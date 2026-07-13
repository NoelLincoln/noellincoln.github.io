# API Reference

Base URL: `${NEXT_PUBLIC_API_URL}` (e.g. `http://localhost:8000`).
All endpoints are under `/api/`. Payloads are JSON.

## Auth model

- Authentication is **JWT bearer tokens** (`Authorization: Bearer <access>`),
  issued by `djangorestframework-simplejwt`.
- Access tokens live **1 hour**; refresh tokens live **7 days**.
- DRF's default permission is `IsAuthenticatedOrReadOnly`; each view below states
  its own rule.
- `is_staff` is included in the token response so the frontend can gate write UI.

## Posts

### `GET /api/posts/`
List published posts, newest first. **Public.**

```json
[
  {
    "id": 1,
    "title": "From Static Site to Full Stack",
    "slug": "from-static-site-to-full-stack",
    "body": "# Markdown body…",
    "category": { "id": 2, "name": "Journey", "slug": "journey" },
    "status": "published",
    "published_at": "2026-06-14T10:00:00Z",
    "created_at": "2026-06-14T09:55:00Z"
  }
]
```

### `POST /api/posts/`
Create a post. **Staff only** (`IsStaffOrReadOnly`).

```json
{
  "title": "My post",
  "slug": "my-post",
  "body": "# Hello",
  "category_id": 2,
  "status": "published",
  "published_at": "2026-07-13T12:00:00Z"
}
```

`category_id` is write-only and optional; the response echoes the nested
`category` object. `status` is `draft` or `published` — drafts are never returned
by the list/detail endpoints.

### `GET /api/posts/<slug>/`
Retrieve one published post by slug. **Public.** `404` if it's a draft or missing.

## Categories

### `GET /api/categories/`
List all categories. **Public.**

### `POST /api/categories/`
Create a category. **Staff only.**

```json
{ "name": "Django", "slug": "django" }
```

## Comments

### `GET /api/posts/<slug>/comments/`
List a post's comments, oldest first. **Public.**

```json
[
  {
    "id": 5,
    "author_name": "noel",
    "body": "Great write-up!",
    "like_count": 3,
    "created_at": "2026-06-15T08:30:00Z"
  }
]
```

### `POST /api/posts/<slug>/comments/`
Add a comment. **Any authenticated user** (`IsAuthenticatedOrReadOnly`).
The author and post are set server-side from the token and URL.

```json
{ "body": "Nice post!" }
```

### `POST /api/posts/<slug>/comments/<id>/like/`
Toggle a like on a comment. **Authenticated.** Idempotent per user — calling it
again removes the like. Returns the fresh state:

```json
{ "like_count": 4, "liked": true }
```

## Authentication endpoints

### `POST /api/auth/register/`
Create an account. **Public.** Validates unique username/email, min 8-char password.

```json
{ "username": "noel", "email": "noel@example.com", "password": "••••••••" }
```

### `POST /api/auth/token/`
Obtain a JWT pair from username + password. **Public.** Rate limited to
**5 requests/minute** per client. Response includes `is_staff`:

```json
{ "access": "…", "refresh": "…", "is_staff": true }
```

### `POST /api/auth/token/refresh/`
Exchange a refresh token for a fresh access token. **Public.**

```json
{ "refresh": "…" }
```

### `POST /api/auth/social/`
Server-to-server endpoint called by NextAuth after a successful Google sign-in.
Finds or creates a Django user for the Google email and returns a JWT pair.
**Public** (trusted because it's called from the NextAuth server callback).

```json
{ "email": "noel@example.com", "name": "Noel" }
```

## Status codes you'll see

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created (register, post, comment) |
| `400` | Validation error (body echoes field errors) |
| `401` | Missing/expired token — client refreshes or redirects to `/login` |
| `403` | Authenticated but not staff (e.g. non-staff creating a post) |
| `404` | Not found (or a draft post requested publicly) |
| `429` | Login throttled (more than 5 attempts/minute) |
