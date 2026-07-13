# Plan

## Goals

- Learn Python through building a real Django project.
- Improve Next.js / React skills by building on top of what's already here.
- End result: a portfolio site with a working blog powered by Django + PostgreSQL.

## Frontend (Next.js) — done

- [x] App Router shell: `layout.tsx`, `page.tsx`, `ThemeProvider`
- [x] `Header` with dark-mode toggle + mobile menu
- [x] Sections: Hero, Projects, About, Contact
- [x] `data/projects.ts` static project data
- [x] `globals.css` design tokens (light/dark), Tailwind v4
- [x] shadcn/ui component set (button, card, badge, avatar, dropdown, etc.)
- [ ] SEO: `generateMetadata`, `sitemap.xml`, `robots.txt`, JSON-LD
- [ ] Deploy to Vercel

## Blog — Django + PostgreSQL Backend

### Step 1: Django project scaffold — done

- [x] `backend/` Django project (`core`) + DRF, CORS, SimpleJWT
- [x] PostgreSQL via `DATABASE_URL` (django-environ)
- [x] `.env` strategy for both apps

### Step 2: Blog models — done

- [x] `blog` app with `Category`, `Post` (+ `status`, `published_at`), `Comment`
- [x] Registered in Django admin
- [x] Migrations applied

### Step 3: REST API — done

- [x] Serializers for `Category`, `Post`, `Comment`
- [x] `GET/POST /api/posts/`, `GET /api/posts/<slug>/`, `GET/POST /api/categories/`
- [x] `GET/POST /api/posts/<slug>/comments/`, like toggle endpoint
- [x] Permissions: `IsStaffOrReadOnly`, `IsAuthenticatedOrReadOnly`

### Step 4: Connect Next.js to the API — done

- [x] Typed API client in `frontend/src/lib/api.ts`
- [x] `/blog` list page and `/blog/[slug]` detail page (server components)
- [x] `/blog/create` page with markdown editor
- [x] Blog link in Header nav

### Step 5: Auth — done

- [x] SimpleJWT token + refresh endpoints
- [x] NextAuth v5: Credentials + Google providers, token refresh callback
- [x] `SocialAuthView` exchanges Google identity for a Django JWT
- [x] Middleware-protected routes (`/blog/create`, `/blog/categories`)
- [x] `is_staff` claim + login rate limiting (5/min)

### Step 6: Quality & delivery — done

- [x] Vitest at 100% coverage on core modules; pytest backend tests
- [x] GitHub Actions CI (lint + test + build)
- [x] Husky pre-commit / pre-push hooks
- [x] Dockerised backend (gunicorn) + Postgres (docker-compose)

### Step 7: Polish — remaining

- [ ] Pagination on post list
- [ ] Category filter on the blog list
- [ ] Reading-time estimate
- [ ] Code-block syntax highlighting
- [ ] Deploy backend + frontend to production

## Branching Rule

- Always branch from `develop`.
- Format: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
- One branch per step above.
