# Part 3 — Wiring It Together: Markdown and Auth

*Series: [Learning in Public](./README.md) · Prev: [← Building the Backend](./part-2-building-the-blog-backend-with-django.md) · Next: [Making It Real →](./part-4-comments-tests-ci-and-docker.md)*

---

Two apps that don't talk to each other aren't a full-stack app — they're two demos.
This post is about the seam: connecting Next.js to Django with a typed client,
rendering markdown posts, and then the piece that ate the most days by far —
**authentication across two token systems**.

## One typed client for the whole frontend

I decided early that **exactly one file** would know how to talk to the backend:
`src/lib/api.ts`. Every fetch lives there, and every request/response shape is a
TypeScript interface. The rest of the app imports functions, never URLs.

```ts
export interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  category: Category | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
```

Two payoffs I felt immediately:

- **The `Post` interface mirrors the DRF serializer.** When the two agree, the whole
  app is type-safe end to end. When they drift, TypeScript tells me where.
- **`cache: "no-store"`** means a freshly published post shows up on the next page
  load — no rebuild. (That's a deliberate trade: correctness now over caching. Tuning
  it is on my list.)

## Server components render the blog for free

Because App Router pages are server components, the blog list and detail pages fetch
on the server and ship HTML — great for SEO, no client-side loading spinner:

```tsx
export default async function BlogPage() {
  const [posts, session] = await Promise.all([getPosts(), auth()]);
  // …render posts; show "Write a post" only if session?.isStaff
}
```

The detail page fetches the post *and* its comments in parallel with
`Promise.all` — a small thing that removes a request waterfall.

## Rendering markdown

Posts are stored as markdown in the database (that `body` TextField). On the detail
page I render it with `react-markdown`, styled by the Tailwind Typography plugin so
headings, lists, and code blocks look right without hand-writing CSS:

```tsx
<div className="prose prose-neutral dark:prose-invert max-w-none">
  <ReactMarkdown>{post.body}</ReactMarkdown>
</div>
```

For *writing* posts I added a markdown editor with live preview
(`@uiw/react-md-editor`). It uses browser-only APIs, so it can't render on the
server — the fix is a dynamic import with SSR turned off:

```tsx
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
```

That one line — `ssr: false` — is the answer to a whole category of "works in dev,
explodes in build" errors. If a component reaches for `window`, it can't run on the
server.

## Authentication: the long part

Here's the puzzle that took me longest to *understand*, let alone build. I had two
different systems that each wanted to own "who is the user":

- **Django (SimpleJWT)** issues JSON Web Tokens. My API trusts a request if it
  carries a valid `Authorization: Bearer <token>`.
- **NextAuth (v5)** manages the session on the frontend — the sign-in UI, the
  session cookie, Google OAuth.

The insight that unlocked it: **NextAuth owns the browser session; Django owns the
API.** So NextAuth's job is to *obtain and carry a Django JWT* on the user's behalf.
NextAuth is the front door; the JWT is the keycard it hands to the API.

### Username + password

The Credentials provider posts to Django's token endpoint and stashes the returned
tokens on the NextAuth user:

```ts
Credentials({
  async authorize(credentials) {
    const res = await fetch(`${API_URL}/api/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });
    if (!res.ok) return null;
    const tokens = await res.json();
    return {
      id: credentials.username as string,
      name: credentials.username as string,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      isStaff: tokens.is_staff ?? false,
    };
  },
})
```

### Google sign-in, with a twist

Google can tell me *who someone is*, but my Django API doesn't trust Google tokens —
it trusts *its own* JWTs. So after a Google login I exchange the Google identity for
a Django JWT in the NextAuth `jwt` callback:

```ts
if (account?.provider === "google" && user) {
  const res = await fetch(`${API_URL}/api/auth/social/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, name: user.name }),
  });
  const tokens = await res.json();   // Django's access + refresh
  return { ...token, accessToken: tokens.access, refreshToken: tokens.refresh, /* … */ };
}
```

On the Django side, `SocialAuthView` finds or creates a user for that Google email
and mints a JWT pair. It even de-duplicates usernames derived from the email's local
part so two people named `noel@…` don't collide. So no matter *how* you sign in —
password or Google — the app ends up holding the same kind of credential: a Django
JWT. Everything downstream only has to understand one thing.

### Keeping the token fresh

Access tokens expire after an hour. Rather than let a request fail, the `jwt`
callback refreshes the token ~5 minutes before expiry:

```ts
if (Date.now() < (token.accessTokenExpires ?? 0)) return token;  // still valid
return refreshAccessToken(token);                                 // expired → refresh
```

Getting this wrong means users get logged out mid-action; getting it right means
they never notice tokens exist at all. That's the goal — auth you can't feel.

## Guarding routes and gating writes

Two layers protect the author-only areas.

**Frontend (middleware)** redirects anonymous users away from the create/categories
pages before the page even renders:

```ts
export default auth((req) => {
  const protectedPaths = ["/blog/create", "/blog/categories"];
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});
```

**Backend (permissions)** is the one that actually matters — because anyone can
bypass a frontend. Publishing requires a *staff* user:

```python
class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:      # GET/HEAD/OPTIONS → always allowed
            return True
        return bool(request.user and request.user.is_authenticated
                    and request.user.is_staff)  # writes → staff only
```

**The lesson I want to underline: frontend guards are UX, backend permissions are
security.** The middleware stops a signed-out visitor from seeing a form they can't
use. `IsStaffOrReadOnly` stops a logged-in non-staff user from `POST`ing to
`/api/posts/` with `curl`. You need both, and only one of them is optional.

To make the staff check cheap on the frontend, I added `is_staff` as a claim on the
token response, so the UI can hide the "Write a post" button without an extra API
call:

```python
class StaffClaimTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["is_staff"] = self.user.is_staff
        return data
```

And because a login endpoint is a brute-force target, I throttled it — 5 attempts
per minute, on its own scope so it doesn't affect normal reads:

```python
class LoginRateThrottle(AnonRateThrottle):
    scope = "login"   # REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {"login": "5/minute"}
```

## What I'd tell past me

- **Have exactly one API module.** One typed boundary keeps the frontend and backend
  honest and makes drift a compile error.
- **`ssr: false` for anything that touches `window`.** It's the fix for a whole
  class of build-time crashes.
- **Name who owns what.** NextAuth owns the browser session; Django owns the API.
  Once I said that out loud, the token dance made sense.
- **Normalise auth to one credential.** Password and Google both end as a Django JWT,
  so the rest of the app only learns one thing.
- **Frontend guards are UX; backend permissions are security.** Ship both, but never
  trust the client.

Next: letting readers talk back with comments and likes, then making the whole thing
trustworthy with tests, CI, and Docker.

*Next: [Making It Real: Comments, Tests, CI & Docker →](./part-4-comments-tests-ci-and-docker.md)*
