# Architecture

## The big picture

```
┌─────────────────────────┐         HTTPS / JSON        ┌──────────────────────────┐
│  Next.js 16 (frontend)  │  ───────────────────────▶   │  Django 6 + DRF (backend) │
│  App Router, Tailwind   │   /api/posts, /api/auth…    │  gunicorn in production   │
│  NextAuth v5            │  ◀───────────────────────   │                          │
└───────────┬─────────────┘        JWT access token     └────────────┬─────────────┘
            │                                                          │
   renders in the browser                                     ┌────────▼────────┐
   (server + client comps)                                    │   PostgreSQL     │
                                                              └──────────────────┘
```

Two independently deployable apps talking over a JSON REST API. The frontend never
touches the database directly — everything goes through DRF.

## Frontend (Next.js, App Router)

- **Server Components by default.** The blog list (`/blog`) and detail
  (`/blog/[slug]`) pages are async server components that fetch from the API at
  request time (`cache: "no-store"`), so new posts appear without a rebuild.
- **Client Components where interactivity is needed** — the create page
  (`/blog/create`) and the comment section (`"use client"`), which use hooks and
  the browser-only markdown editor.
- **Typed API client** (`src/lib/api.ts`) is the single boundary to the backend.
  Every request/response shape is a TypeScript interface, so the whole app shares
  one definition of a `Post`, `Comment`, and `Category`.
- **Auth** is handled by NextAuth v5 (`src/auth.ts`). It stores the Django JWT in
  the NextAuth session and refreshes it before expiry. `proxy.ts` (the file
  convention formerly called `middleware`) guards the author-only routes.

## Backend (Django + DRF)

- **`core/`** — project config. Settings read from the environment with
  `django-environ`, including `DATABASE_URL` and `CORS_ALLOWED_ORIGINS`.
- **`blog/`** — the single app that holds everything: models, serializers,
  class-based DRF views, custom permissions, JWT token customisation, and auth
  views for registration and social login.
- **Auth strategy** — DRF's default is `IsAuthenticatedOrReadOnly`; individual
  views tighten this. Writes to posts/categories require a _staff_ user
  (`IsStaffOrReadOnly`); commenting requires any authenticated user.

## Data model

```
Category 1 ──── * Post 1 ──── * Comment * ──── * User (likes, M2M)
                                   │
                                   * ─── 1 User (author)
```

- **Category** — `name`, `slug`.
- **Post** — `title`, `slug` (unique, used in URLs), `body` (markdown), optional
  `category`, `status` (`draft` / `published`), `published_at`, `created_at`.
  Only `published` posts are exposed by the API.
- **Comment** — belongs to a `Post` and an author `User`; has a `likes`
  many-to-many to `User` so each user can like a comment at most once.

## Request lifecycle: publishing a post

1. Staff user signs in → NextAuth stores a Django JWT (with an `is_staff` claim).
2. They open `/blog/create` (the proxy allows it because they're authenticated).
3. They write markdown in the editor and submit.
4. The browser `POST`s to `/api/posts/` with `Authorization: Bearer <jwt>`.
5. DRF checks `IsStaffOrReadOnly` → allowed only if `is_staff`.
6. The post is saved; the user is redirected to `/blog/<slug>`.

## Request lifecycle: reading + commenting

1. `/blog/[slug]` server-fetches the post **and** its comments in parallel.
2. Markdown is rendered with `react-markdown` + the Tailwind Typography plugin.
3. A signed-in reader posts a comment → `POST /api/posts/<slug>/comments/`.
4. Liking a comment is a single toggle endpoint that adds/removes the user and
   returns the fresh count; the UI updates optimistically.

## Why this shape?

- **SEO + speed** from Next.js server rendering.
- **A real backend to learn on** — models, migrations, the admin, DRF, auth, and
  Postgres, rather than locking content into frontend-only markdown files.
- **Clear seam** between the two: the typed API client is the only contract, which
  keeps the frontend and backend swappable and independently testable.

See [API.md](./API.md) for the endpoint contract and [SETUP.md](./SETUP.md) to run it.
