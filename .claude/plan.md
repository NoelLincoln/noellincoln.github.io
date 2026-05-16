# Plan

## Goals

- Learn Python through building a real Django project.
- Improve Next.js / React skills by building on top of what's already here.
- End result: a portfolio site with a working blog powered by Django + PostgreSQL.

## Current State (Next.js frontend)

Already built in `frontend/src/`:

- `layout.tsx` — root shell, Poppins font, ThemeProvider, Lottie script
- `page.tsx` — assembles all sections
- `components/layout/Header.tsx` — fixed header, dark mode toggle, mobile menu
- `components/sections/Hero.tsx` — typing animation, social links, Lottie
- `components/sections/Projects.tsx` — project cards + case study modal
- `components/sections/About.tsx` — bio, skills accordion
- `components/sections/Contact.tsx` — Formspree contact form
- `data/projects.ts` — static project data
- `globals.css` — design tokens (light/dark), Tailwind v4

## What's Left on the Frontend

- [ ] Footer component
- [ ] Verify the site looks right end-to-end (run `npm run dev`)
- [ ] SEO: `generateMetadata`, `sitemap.xml`, `robots.txt`
- [ ] Deploy to Vercel

## Blog — Django + PostgreSQL Backend

Build this in `backend/` once frontend is deployed.

### Step 1: Django project scaffold

- Create `backend/` Django project.
- Install: `django`, `djangorestframework`, `django-cors-headers`, `psycopg2-binary`, `python-dotenv`.
- Connect to PostgreSQL (local dev DB).
- Confirm `python manage.py runserver` works.

### Step 2: Blog models

- Create a `blog` Django app.
- Models: `Post` (title, slug, body, published_at, status), `Category` (name, slug).
- Register both in Django admin.
- Run migrations and confirm admin works.

### Step 3: REST API

- DRF serializers for `Post` and `Category`.
- Endpoints:
  - `GET /api/posts/` — published posts list
  - `GET /api/posts/<slug>/` — single post
  - `GET /api/categories/` — category list
- Read-only for now (no auth needed yet).

### Step 4: Connect Next.js to the API

- Add a typed API client in `frontend/src/lib/api.ts`.
- Add `/blog` page — fetches post list from Django.
- Add `/blog/[slug]` page — fetches single post.
- Add Blog link to Header nav.

### Step 5: Polish

- Pagination on post list.
- Category filter.
- Reading time estimate.
- Code block syntax highlighting.

## Branching Rule

- Always branch from `develop`.
- Format: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.
- One branch per step above.
