# Learning in Public: Rebuilding My Portfolio as a Full-Stack App

This is the story of taking my portfolio from a static HTML/CSS/JS site I built in
2023 to a full-stack application with a Next.js frontend, a Django REST API, a
PostgreSQL database, authentication, comments, tests, and Docker.

I wrote it as a journey — the decisions, the dead ends, and the small "oh, *that's*
how it works" moments — because that's the part tutorials skip. It's also **not
finished**: the app is live end-to-end, but deployment, SEO, and polish are still
ahead. I'll keep adding to the series as I go.

## The series

1. **[From a Static Site to Full Stack](./part-1-from-static-site-to-full-stack.md)**
   — why I rebuilt a site that worked, how I chose the stack, and building the
   Next.js frontend.
2. **[Building the Blog's Backend with Django + DRF](./part-2-building-the-blog-backend-with-django.md)**
   — my first real Django models, the admin, a REST API, and PostgreSQL.
3. **[Wiring It Together: Markdown and Auth](./part-3-wiring-it-together-markdown-and-auth.md)**
   — a typed API client, rendering markdown, and the part that took longest: JWT +
   NextAuth + Google sign-in.
4. **[Making It Real: Comments, Tests, CI & Docker](./part-4-comments-tests-ci-and-docker.md)**
   — comments and likes, getting to 100% test coverage, a CI pipeline, Docker —
   and an honest look at what's left.

## The stack, at a glance

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui |
| Backend | Django 6, Django REST Framework |
| Database | PostgreSQL 16 |
| Auth | SimpleJWT (API) + NextAuth v5 (client), Google OAuth |
| Tooling | Ruff, ESLint, Prettier, pytest, Vitest, Husky, GitHub Actions, Docker |

## How to read it

Each post stands on its own, but they're in build order. Code snippets are real —
lightly trimmed for clarity, but they match what's in the repo. Every post ends with
a short "what I'd tell past me" so the lessons aren't buried in the code.
