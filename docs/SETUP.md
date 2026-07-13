# Local Setup

You can run the two apps directly, or run the backend + database with Docker.

## Prerequisites

- Node.js 22+
- Python 3.12+
- PostgreSQL 16 (or use the Docker Compose database)

## 1. Backend (Django)

```bash
cd backend
python -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env` (see `backend/.env.example`):

```dotenv
SECRET_KEY=dev-secret-change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://portfolio_user:password@localhost:5432/portfolio_blog
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Then migrate and run:

```bash
python manage.py migrate
python manage.py createsuperuser   # gives you a staff user who can publish
python manage.py runserver          # http://localhost:8000
```

The Django admin is at `http://localhost:8000/admin/`.

> **Staff = author.** Only users with `is_staff=True` can create posts or
> categories through the API. Your superuser is staff by default.

## 2. Frontend (Next.js)

```bash
cd frontend
npm install
```

Create `frontend/.env.local` (see the root `.env.example`):

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_SECRET=dev-secret-change-me
NEXTAUTH_URL=http://localhost:3000
# Optional — only needed for Google sign-in:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Then:

```bash
npm run dev    # http://localhost:3000
```

## 3. Docker (backend + Postgres)

The root `docker-compose.yml` runs Postgres and the gunicorn-served backend.
Provide a `.env` at the repo root with at least:

```dotenv
SECRET_KEY=...
DB_PASSWORD=...
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

```bash
docker compose up --build
```

On start the backend `entrypoint.sh` runs migrations, collects static files, and
launches gunicorn on port `8000`. Postgres data persists in the `postgres_data`
volume, and the backend waits for the DB healthcheck before starting.

## 4. Quality checks

Frontend:

```bash
npm run lint --workspace=frontend
npm run format:check --workspace=frontend
npm test --workspace=frontend      # Vitest + coverage (100% on core modules)
npm run build --workspace=frontend
```

Backend:

```bash
cd backend
ruff check .
ruff format --check .
pytest
```

Husky runs the fast checks automatically on `git commit` (formatting, lint,
lint-staged) and the test suites on `git push`. CI re-runs everything on PRs to
`develop` and `main` — see `.github/workflows/linters.yml`.

## Common gotchas

- **CORS errors** — make sure the frontend origin is in `CORS_ALLOWED_ORIGINS`.
- **401 on create/comment** — the JWT expired; the app refreshes automatically,
  but if refresh fails you'll be redirected to `/login`.
- **403 on create** — you're signed in but not `is_staff`. Flip the flag in the
  Django admin.
- **Markdown editor blank on first paint** — it's a client-only dynamic import
  (`ssr: false`); that's expected.
