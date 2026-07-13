# Documentation

Project documentation for the portfolio + blog. Start here.

| Doc | What it covers |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | How the frontend, backend, and database fit together |
| [SETUP.md](./SETUP.md) | Running the frontend, backend, and Docker locally |
| [API.md](./API.md) | Every REST endpoint, its auth rules, and payloads |
| [PROGRESS.md](./PROGRESS.md) | The build journal — what shipped, when, and what's next |

## What is this project?

A personal portfolio at [noellincoln.github.io](https://github.com/NoelLincoln/noellincoln.github.io)
that started life in 2023 as a static HTML/CSS/JS site and was rebuilt in 2026 as a
full-stack application:

- **Frontend** — Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui.
- **Backend** — Django 6 + Django REST Framework.
- **Database** — PostgreSQL.
- **Auth** — SimpleJWT on the API, NextAuth v5 (credentials + Google) on the client.
- **Delivery** — Ruff/ESLint/Prettier, pytest + Vitest (100% on core modules),
  GitHub Actions CI, Husky hooks, Docker for the backend.

The headline feature is a **blog**: a staff user writes markdown posts through a
protected create page, anyone can read them with rendered markdown, and signed-in
readers can comment and like.

> The learning story behind all of this is written up as a series in
> [`../blogs/`](../blogs/README.md).

## Repository layout

```
.
├── frontend/          Next.js app (App Router)
│   └── src/
│       ├── app/       routes: /, /blog, /blog/[slug], /blog/create, /login, /register
│       ├── components/ layout, sections, blog, ui (shadcn)
│       ├── lib/       api client, async helper, utils
│       ├── auth.ts    NextAuth config (providers, jwt/session callbacks)
│       └── middleware.ts  route protection
├── backend/           Django project
│   ├── core/          settings, urls, wsgi/asgi
│   └── blog/          models, serializers, views, permissions, auth, tests
├── docs/              you are here
├── blogs/             the learning-in-public series
├── docker-compose.yml Postgres + backend
└── .github/workflows/ CI
```
