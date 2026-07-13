# Objectives

## Product Goals

- Migrate the portfolio from static HTML/CSS/JS to Next.js + Tailwind CSS + shadcn/ui + Framer Motion. **(done)**
- Ship the UI first with static data, then layer in the backend. **(done)**
- Add a Django + PostgreSQL backend to power the blog. **(done)**
- Let a staff author publish markdown posts; let readers comment and like. **(done)**
- Preserve and improve SEO (metadata, sitemap, structured data). **(in progress)**

## Learning Goals

- Build practical Next.js App Router skills — components, routing, server vs. client, Tailwind. **(done)**
- Build practical Django skills — models, admin, DRF serializers/views, permissions. **(done)**
- Learn token auth end-to-end: SimpleJWT + NextAuth (credentials + Google), refresh flow. **(done)**
- Practise a real delivery workflow: linting, tests + coverage, CI, Docker. **(done)**

## MVP Definition — met

- Next.js app with all portfolio sections: Hero, Projects, About, Contact.
- Blog powered by the Django API: list, detail (markdown), create, comments, likes.
- Auth with staff-gated publishing.
- Dark/light mode.
- Tested (Vitest 100% on core modules + pytest) and CI-enforced.

## Current Non-Goals

- No pagination / category filtering yet (planned polish).
- No SSR caching / ISR tuning yet (fetches are `no-store` for now).
- No custom analytics or newsletter.
- Production deployment still pending.
