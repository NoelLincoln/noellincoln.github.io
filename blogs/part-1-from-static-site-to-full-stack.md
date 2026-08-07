# Part 1 — From a Static Site to Full Stack

_Series: [Learning in Public](./README.md) · Next: [Building the Backend →](./part-2-building-the-blog-backend-with-django.md)_

---

In 2023 I built my portfolio the honest way: hand-written HTML, CSS, and vanilla
JavaScript, deployed to GitHub Pages. It had a mobile menu I wired up with event
listeners, project cards that opened popups, a contact form with its own validation
function, and — after a lot of commits with messages like _"solve largest
contentful paint issue"_ — a genuinely fast Lighthouse score. I converted images to
WebP, lazy-loaded them, minified the CSS, and chased down layout shift.

It worked. So why rebuild it?

## Why tear down something that works

Two reasons, and only one of them was technical.

1. **I wanted to learn.** The static site had hit its ceiling as a _learning_
   project. I could keep polishing pixels, but I wasn't learning anything new. I
   wanted to understand how a real full-stack app fits together: a backend, a
   database, authentication, an API contract between two apps.
2. **I wanted a blog I actually owned.** Not markdown files hard-coded into the
   frontend — a real content system I could write into, with categories, drafts,
   and comments. That meant a database and an admin, which meant a backend.

The rule I set for myself: _don't rebuild for the sake of it — rebuild to learn
specific things._ I wrote those learning goals down before touching code.

## Choosing the stack

I gave myself a short list of decisions and a reason for each.

**Frontend: Next.js.** I already knew React, and Next.js gave me server rendering
for SEO (a portfolio that doesn't show up in search is a bad portfolio) plus a
routing and data-fetching story that scales past "one HTML file per page."

**Backend: Django + Django REST Framework.** I wanted to learn Python properly, and
Django hands you an ORM, migrations, an admin UI, and auth out of the box. DRF turns
models into a JSON API without much ceremony. For someone learning, "batteries
included" was the whole point — I'd see how the pieces are _supposed_ to fit before
trying to assemble them myself.

**Database: PostgreSQL.** The default serious choice, and the push I needed to stop
avoiding "real" databases.

The principle I kept coming back to, straight from my planning notes:

> Avoid locking blog content in frontend-only markdown files.

Content belongs in a database you can query, moderate, and grow — not in the git
history of your UI. (The _learning notes_, like this series, are fine as markdown.
Know which is which.)

## Planning before code

Before writing a line, I wrote three short docs: **objectives** (product + learning
goals, plus explicit _non-goals_ to stop scope creep), **plan** (the build split
into one-branch-sized steps), and a **roadmap** (models → API → integration → auth →
tests → deploy).

This felt like overkill for a personal project. It wasn't. Months later I switched
machines and lost my uncommitted working folder — those _committed_ planning docs
were the thing that let me pick the thread back up. **Write down what you're doing
and why, and commit it. Your future self is a different person with amnesia.**

## The phasing decision that saved me

My first instinct was to build frontend and backend together. I changed my mind
early and committed to a **frontend-first** approach: build the entire Next.js UI
with _static, hard-coded data_, ship it, and only then start Django.

Why? It let me get a working, deployable site fast (motivation matters), learn
Next.js without also fighting CORS and migrations, and define the _shape_ of my data
from the UI's needs before building an API to match. One new hard concept at a time.

## Building the frontend

I scaffolded a Next.js App Router app in a `frontend/` folder with TypeScript and
Tailwind v4, and added [shadcn/ui](https://ui.shadcn.com) for accessible base
components (buttons, cards, badges, dropdowns) I could restyle instead of build from
scratch.

A few things clicked here that are worth calling out.

**The App Router's mental model is "server by default."** Pages are async server
components that can `await` data directly — no `useEffect`, no loading spinner
boilerplate. You only reach for `"use client"` when you need interactivity (state,
event handlers, browser APIs). Coming from create-react-app, this was the biggest
shift, and the most freeing once it landed.

**Design tokens made dark mode almost free.** I defined colours as CSS variables in
`globals.css` for light and dark, wired up `next-themes` with a `ThemeProvider`, and
then every component just used `bg-background` / `text-foreground`. Dark mode became
a single class on `<html>` instead of a per-component chore.

**Static data first was the right call.** I put my projects in a plain
`data/projects.ts` file and built the whole UI — Hero with a typing animation, a
Projects grid with case-study cards, About, Contact — against it. The site was
real and deployable before a backend existed. When I later built the API, I already
knew exactly what a `Post` needed to contain, because the UI had told me.

The structure I landed on:

```
frontend/src/
├── app/            routes (/, /blog, /blog/[slug], /blog/create, /login…)
├── components/
│   ├── layout/     Header (nav, dark-mode toggle, mobile menu)
│   ├── sections/   Hero, Projects, About, Contact
│   ├── blog/       CommentSection
│   └── ui/         shadcn primitives
├── lib/            api client, helpers
└── data/           static project data
```

## What I'd tell past me

- **Rebuild to learn a named thing, not because the old thing is "old."** If you
  can't say what you'll learn, don't rebuild.
- **Write the plan down and commit it to git.** Uncommitted notes are one new laptop
  away from gone (ask me how I know).
- **Ship the UI with fake data first.** It keeps you to one hard new concept at a
  time and lets your interface define your data model.
- **Learn the server/client split early.** In the App Router, "what runs where" is
  the thing to get straight before anything else makes sense.

Next up: the scary part for a frontend dev — building an actual backend. Django
models, the admin, and turning them into a REST API.

_Next: [Building the Blog's Backend with Django + DRF →](./part-2-building-the-blog-backend-with-django.md)_
