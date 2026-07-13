# Build Journal

A factual timeline of how the project was built, drawn from the git history.
For the working checklist see [`../.claude/plan.md`](../.claude/plan.md).

## Status

- **Shipped:** full-stack blog — publish, read (markdown), comment, like.
- **Tested:** Vitest at 100% on core modules; pytest on the backend; CI enforced.
- **Containerised:** backend + Postgres via Docker Compose.
- **Analytics:** Google Analytics 4 + Microsoft Clarity wired (env-gated).
- **Next:** deploy the Django backend, SEO, and blog polish (pagination, filtering).

## Timeline

### 2023 — the static portfolio

A hand-written HTML/CSS/JS site: mobile menu, project popups, contact-form
validation, and a long performance pass (WebP images, lazy-loading, minification,
fixing layout shift and LCP). Deployed on GitHub Pages.

### Apr 2026 — the rebuild decision

- Revamped the static UI with dark mode, then decided to rebuild in Next.js.
- Wrote the planning pack in `.claude/`: objectives, plan, roadmap.
- Rebuilt the portfolio as a Next.js App Router app (Tailwind v4, shadcn/ui),
  frontend-first with static data.

### May 2026 — Django foundation

- Scaffolded the Django `blog` app: `Category` + `Post` models, serializers, admin.
- Configured CORS, environment variables, PostgreSQL, Ruff, and Husky hooks.

### Jun 2026 — the blog comes alive

- Built the blog list and detail pages against the Django API (typed client).
- Added markdown rendering, then a markdown-editor create page.
- Added JWT auth + Google OAuth (NextAuth v5) and middleware-protected routes.
- Added staff-only publishing, an `is_staff` JWT claim, and login rate limiting.
- Built comment threads with a like/unlike toggle.
- Added the Vitest suite with 100% coverage enforcement.

### Jun 14 2026 — containerisation

- Dockerised the backend (gunicorn) with a Postgres service and healthcheck.

### Jul 13 2026 — recovery + docs

- Recovered the `.claude/` planning pack after a machine change (it lived on the
  `feat/redo-portfolio-with-next` branch, not in the fresh clone).
- Recreated this `docs/` folder and wrote the `blogs/` learning series.

### Jul 2026 — going live on the frontend

- Added a static-content blog fallback so the frontend deploys on Vercel before
  the backend exists (`src/data/posts.json`, served when `NEXT_PUBLIC_API_URL` is unset).
- Added analytics — Google Analytics 4 + Microsoft Clarity — env-gated, under
  `frontend/src/components/analytics/`.

## What's left

1. **Deploy the backend** — Render/Fly/Railway (Django + Postgres); then point
   `NEXT_PUBLIC_API_URL` at it to switch the blog off static content.
2. **SEO** — `generateMetadata` per post, `sitemap.xml`, `robots.txt`, JSON-LD.
3. **Polish** — pagination, category filtering, reading time, code highlighting.
