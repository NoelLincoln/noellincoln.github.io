# Part 4 — Making It Real: Comments, Tests, CI & Docker

*Series: [Learning in Public](./README.md) · Prev: [← Wiring It Together](./part-3-wiring-it-together-markdown-and-auth.md)*

---

A blog you can read is nice. A blog people can *talk on*, that you can change without
fear, and that runs the same everywhere — that's a real product. This post covers the
last stretch of the journey so far: comments and likes, getting to 100% test
coverage, a CI pipeline, and Docker. And because the project isn't finished, it ends
with an honest look at what's still ahead.

## Comments and likes

Comments meant a third model, and my first real many-to-many relationship.

```python
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                               related_name="comments")
    body = models.TextField()
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                   related_name="liked_comments", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

The `likes` field is where it got interesting. I first reached for a `like_count`
integer — and immediately hit the classic bug: nothing stops the same person liking
twice. A **many-to-many to `User`** fixes it by design: a user is either in the set or
not, so a like is inherently one-per-person, and the count is just `likes.count()`.
*Model the truth, and the bug becomes unrepresentable.*

Two permission levels fell out naturally:

- **Commenting** needs any signed-in user → `IsAuthenticatedOrReadOnly`.
- **Publishing** needs staff → `IsStaffOrReadOnly` (from Part 3).

The author and post are never trusted from the request body — they're set
server-side from the token and the URL:

```python
def perform_create(self, serializer):
    post = get_object_or_404(Post, slug=self.kwargs["slug"])
    serializer.save(post=post, author=self.request.user)
```

Liking is a single **toggle** endpoint — the same call likes or unlikes, and returns
the fresh truth so the client never has to guess:

```python
def post(self, request, slug, pk):
    comment = get_object_or_404(Comment, pk=pk, post__slug=slug)
    if request.user in comment.likes.all():
        comment.likes.remove(request.user); liked = False
    else:
        comment.likes.add(request.user); liked = True
    return Response({"like_count": comment.likes.count(), "liked": liked})
```

On the frontend, the comment section updates **optimistically** — the heart responds
instantly, then reconciles with the server's real count:

```tsx
const result = await likeComment(slug, commentId, session.accessToken);
setComments((prev) =>
  prev.map((c) => (c.id === commentId ? { ...c, like_count: result.like_count } : c))
);
```

The lesson: **let the server be the source of truth, but don't make the user wait for
it.** Update the UI immediately, then trust the response.

## Getting to 100% test coverage (on what matters)

I'd shipped features without tests before and paid for it in regressions. This time I
wanted a safety net — but I also didn't want to chase a meaningless "100%" by testing
trivial files. So I did something I'd recommend: I picked the modules that carry real
logic and demanded *full* coverage of *those*.

```ts
// vitest.config.ts
coverage: {
  provider: "v8",
  include: [
    "src/lib/api.ts",
    "src/lib/handle-async.ts",
    "src/components/layout/Header.tsx",
    "src/components/blog/CommentSection.tsx",
    "src/app/login/page.tsx",
    "src/app/register/page.tsx",
  ],
  thresholds: { lines: 100, branches: 100, functions: 100, statements: 100 },
}
```

The `include` list is the important idea. **100% coverage across a whole app is often
vanity; 100% across your critical modules is a real guarantee.** The API client, the
auth pages, and the comment UI are where a bug actually hurts — so those are locked
in, and the build fails if coverage on them slips.

On the backend, pytest (with `pytest-django`) covers the models and API endpoints —
running against SQLite in CI for speed, Postgres locally for fidelity.

Writing tests also *taught* me the app. Testing the token-refresh branch forced me to
articulate exactly when a token is stale. Tests are a design review you run twice.

## CI: the robot that says no

I wired up GitHub Actions to run on every PR into `develop` and `main`, with five
parallel jobs:

| Job | What it checks |
| --- | --- |
| Backend — Ruff | Python lint + format |
| Backend — Pytest | Django tests |
| Frontend — ESLint | JS/TS lint + Prettier |
| Frontend — Vitest | Tests + the 100% coverage gate |
| Frontend — Build | `next build` actually compiles |

Locally, Husky runs the fast checks on commit and the test suites on push, so I catch
things before CI does:

```sh
# .husky/pre-commit
cd backend && . venv/bin/activate && ruff format . && ruff check . && cd ..
npx lint-staged
npm run lint --workspace=frontend
```

The point of all this isn't ceremony — it's that **"it works on my machine" stops
being something I have to promise.** The robot checks, every time, and I stopped
being the bottleneck for "did I break the build?"

## Docker: same everywhere

The last piece was making the backend run identically anywhere. A slim Python image
installs the dependencies and runs an entrypoint script:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chmod +x entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
```

The entrypoint migrates, collects static files, then hands off to **gunicorn** (the
production server — `runserver` is for development only):

```sh
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120
```

Docker Compose ties the backend to a Postgres service — and the detail I'm proud of
is the **healthcheck**: the backend waits until the database is genuinely ready, not
just "started", so there's no race on boot.

```yaml
db:
  image: postgres:16-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U portfolio_user -d portfolio_blog"]
    interval: 10s
    timeout: 5s
    retries: 5
backend:
  build: ./backend
  depends_on:
    db:
      condition: service_healthy   # wait for the DB, don't just start
```

`docker compose up --build` now brings the whole backend up from nothing — migrations
and all — on any machine with Docker. Which, given that I *lost a machine* partway
through this project, feels like the right note to end on.

## Where we are — and what's next

Everything above is live end-to-end: you can publish a markdown post, read it,
comment, and like, on a tested and containerised stack. But the portfolio **isn't
finished**, and I think it's worth being honest about that. Still ahead:

- **Deployment** — Next.js to Vercel, Django + Postgres to Render/Fly/Railway.
- **SEO** — per-post metadata (`generateMetadata`), `sitemap.xml`, `robots.txt`, and
  JSON-LD structured data for articles.
- **Blog polish** — pagination, category filtering, reading-time estimates, and
  syntax highlighting in code blocks.
- **Caching** — the API fetches are `no-store` today; there's a nicer balance to
  strike with revalidation once traffic is real.

## What I'd tell past me

- **Model constraints instead of enforcing them in code.** A many-to-many made
  "one like per user" a fact, not a rule I had to remember.
- **Optimistic UI + server truth.** Respond instantly, reconcile with the response.
- **Demand 100% coverage on the modules that matter, not the whole tree.** Aim the
  guarantee where a bug actually costs you.
- **Let a robot hold the standard.** CI + hooks mean quality isn't a thing I have to
  remember to do.
- **Containerise early.** The payoff isn't just deployment — it's that any machine,
  including a brand-new one, is one command away from running your app.

Thanks for following the journey. It's ongoing — I'll add to the series as the
deployment and polish work lands.

*Back to the [series index](./README.md).*
