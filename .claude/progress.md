# Progress Tracker

## How to Use

- Update this file at the end of each work session.
- Move checkboxes in `.claude/plan.md` as tasks complete.
- Keep entries short and factual.

## Status Summary

- Date: 2026-07-13
- Overall Status: Core product shipped — blog is live end-to-end
- Current Phase: Phase 6 — deployment & polish
- Blockers: None

## Where We Are

The portfolio has been fully rebuilt as a Next.js + Django + PostgreSQL app.
The blog works end-to-end: publish from an authenticated create page, read with
markdown rendering, comment, and like. Both stacks are linted, tested, and the
backend is containerised.

Shipped:

- Next.js 16 frontend (App Router, Tailwind v4, shadcn/ui, dark mode).
- Django 6 + DRF backend with `Category`, `Post`, `Comment` models.
- Typed API client and blog list / detail / create pages.
- Markdown authoring (react-md-editor) and rendering (react-markdown + typography).
- Auth: SimpleJWT + NextAuth v5 (credentials + Google), token refresh, protected routes.
- Staff-only writes (`IsStaffOrReadOnly`), `is_staff` JWT claim, login rate limiting.
- Comment threads with a like/unlike toggle and optimistic UI.
- Vitest suite at 100% coverage on core modules; pytest for the backend.
- GitHub Actions CI (lint + test + build) and Husky pre-commit / pre-push hooks.
- Dockerised backend (gunicorn) + Postgres via docker-compose.

## Session Log

### 2026-04-23 (Sessions 1–2)

- Created the `.claude/` planning pack. Agreed architecture: Next.js + Django + PostgreSQL.
- Revamped static portfolio UI; decided to build the Next.js UI first, defer Django.

### 2026-04-26 → 2026-05-16

- Rebuilt the portfolio in Next.js (App Router, Tailwind v4). Refocused project direction.

### 2026-05-17 → 2026-06-03

- Scaffolded the Django blog app: models, serializers, admin.
- Configured CORS, env vars, PostgreSQL, Ruff, Husky, and Prettier.

### 2026-06-08 → 2026-06-09

- Built blog list + detail pages against the Django API.
- Added markdown rendering, then the markdown-editor create page.

### 2026-06-11 → 2026-06-13

- Added JWT auth, Google OAuth, and middleware-protected routes.
- Added staff permissions, login rate limiting, and the `is_staff` claim.
- Added the Vitest suite with 100% coverage enforcement.
- Built the comment thread with likes; moved Sign in into the Header.

### 2026-06-14

- Containerised the Django backend with gunicorn and Postgres (docker-compose).

### 2026-07-13

- Recovered the `.claude/` planning pack after a machine change.
- Recreated the human-facing `docs/` folder and a multi-part learning blog series.

## Next 3 Actions

1. Deploy: Next.js on Vercel, Django + Postgres on Render/Fly/Railway.
2. SEO pass: `generateMetadata` per post, `sitemap.xml`, `robots.txt`, JSON-LD.
3. Blog polish: pagination, category filtering, reading time, code highlighting.
