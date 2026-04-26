# Implementation Plan

> **Scope update (2026-04-23):** Migrating to Next.js UI first. No SSR or server-side data fetching in this phase — all data is static/local. Django backend added in a later phase once the UI is complete and deployed.

## Pre-Work Rule (Always First)

- [ ] Use `develop` as the base integration branch for all active work.
- [ ] Fetch and fast-forward `develop` before creating a new branch:
  - `git fetch origin`
  - `git checkout develop`
  - `git pull --ff-only origin develop`
- [ ] Create and switch to a branch before any new feature/fix/chore.
- [ ] Branch format must be one of:
  - `feat/description`
  - `fix/description`
  - `chore/description`
  - `docs/description`
  - `refactor/description`

## Monorepo Structure

```text
noellincoln.github.io/
├── frontend/          ← Next.js app (Phase 1–3)
├── backend/           ← Django (Phase 4, placeholder for now)
├── .claude/           ← planning docs
├── package.json       ← npm workspaces root
└── (legacy static files — kept until frontend is deployed)
```

## Phase 1: Next.js Project Setup

- [ ] Convert root `package.json` to npm workspaces root.
- [ ] Scaffold `frontend/` with Next.js (App Router, TypeScript, Tailwind CSS).
- [ ] Install and configure shadcn/ui.
- [ ] Install Framer Motion.
- [ ] Migrate design tokens (colours, fonts) from `style.css` into `tailwind.config.ts`.
- [ ] Set up `eslint` + `prettier` config.
- [ ] Confirm `npm run dev` runs cleanly from repo root.

## Phase 2: UI Migration (Static Data Only)

- [ ] Build shared layout: Header (with dark mode toggle), mobile menu overlay, Footer.
- [ ] Build Hero section (typing animation, social links, lottie).
- [ ] Build Projects section — project cards + case study popup — data from a local `data/projects.ts` file.
- [ ] Build About section — bio with keyword highlights, skills dropdowns.
- [ ] Build Contact section — form wired to Formspree (existing endpoint).
- [ ] Carry over all dark mode CSS variable logic.
- [ ] Confirm feature parity with current static site.

## Phase 3: SEO & Deployment

- [ ] Add `generateMetadata` per page (title, description, OG, Twitter).
- [ ] Add `sitemap.xml` and `robots.txt`.
- [ ] Deploy to Vercel.
- [ ] Verify OG preview image renders correctly.

## Phase 4: Django Backend (Later)

- [ ] Scaffold Django + DRF + PostgreSQL in `backend/`.
- [ ] Models: Project, ContactMessage (blog if needed later).
- [ ] API endpoints: `/api/projects/`, `/api/contact/`.
- [ ] Swap static `data/projects.ts` for API fetch in Next.js.
- [ ] Deploy backend on Render/Railway.

## Current Focus

- [ ] Scaffold Next.js app and begin Phase 1.
