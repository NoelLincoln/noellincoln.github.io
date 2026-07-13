# Part 2 — Building the Blog's Backend with Django + DRF

*Series: [Learning in Public](./README.md) · Prev: [← From a Static Site to Full Stack](./part-1-from-static-site-to-full-stack.md) · Next: [Wiring It Together →](./part-3-wiring-it-together-markdown-and-auth.md)*

---

With the frontend shipped on static data, it was time for the part I'd been both
excited and nervous about: a real backend. I'd never built one. This is where I
learned Python and Django properly — by needing them for something.

The goal for this phase was small and concrete: **an API that can list posts, return
one post by its slug, and manage categories.** No auth yet, no comments yet. One new
thing at a time.

## Setting up the project

Django's project/app split confused me at first, so here's the mental model that
made it stick:

- A **project** (`core/`) is the whole site's configuration — settings, the root
  URL map, the WSGI entrypoint.
- An **app** (`blog/`) is a self-contained feature — models, views, its own URLs.
  A project is made of apps.

```bash
django-admin startproject core .
python manage.py startapp blog
```

I added Django REST Framework, `django-cors-headers` (the frontend is on a different
origin), and `django-environ` so settings come from the environment instead of being
hard-coded:

```python
# core/settings.py
env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
DATABASES = {"default": env.db("DATABASE_URL")}   # postgres://…
```

That `env.db("DATABASE_URL")` line is lovely — one env var describes the whole
database connection, and the same code works for local Postgres and a managed
production database.

## The models: where the thinking happens

This is the part I'd tell any backend beginner to slow down on. **Your models are
your app.** Everything else — the API, the admin, the frontend types — is a
projection of them. I started with two.

```python
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)


class Post(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"
    STATUS_CHOICES = [(STATUS_DRAFT, "Draft"), (STATUS_PUBLISHED, "Published")]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    body = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

Small decisions that turned out to matter:

- **`slug` is unique and drives the URL.** `/blog/my-first-post` reads better than
  `/blog/1`, and it's stable if I reorder things.
- **`status` (draft vs. published)** means I can save a half-finished post without it
  going live. This one field shaped the whole API — every public query filters to
  `published`.
- **`on_delete=SET_NULL` for the category** — deleting a category shouldn't delete
  the posts in it. Django *makes you* state what happens on delete, which forced me
  to think about it. That's a feature.

Then the two commands that still feel like magic:

```bash
python manage.py makemigrations   # turns model changes into a migration file
python manage.py migrate          # applies them to the database
```

Migrations are version control for your database schema. Coming from hand-writing
SQL, having Django diff my models and generate the change was the moment Django
"sold" me.

## The admin: a free CMS

Three lines and I had a working content management UI:

```python
# blog/admin.py
admin.site.register(Post)
admin.site.register(Category)
```

`python manage.py createsuperuser`, log in at `/admin/`, and I could create posts in
a browser. For a blog, the Django admin *is* the CMS. I didn't have to build one.

## Turning models into an API with DRF

DRF has two core pieces, and once they clicked the rest was repetition.

**A serializer** translates between model instances and JSON, and validates incoming
data. It's the membrane between Python objects and the wire.

```python
class PostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)          # nested on read
    category_id = serializers.PrimaryKeyRelatedField(       # just an id on write
        queryset=Category.objects.all(),
        source="category", write_only=True,
        required=False, allow_null=True,
    )

    class Meta:
        model = Post
        fields = ["id", "title", "slug", "body", "category",
                  "category_id", "status", "published_at", "created_at"]
```

The read/write asymmetry took me a minute to appreciate: when the frontend *reads* a
post it wants the full category object to display; when it *writes* one it only has
an id to send. Exposing `category` (read-only, nested) and `category_id`
(write-only) gives each side exactly what it needs from one serializer.

**A view** decides which objects are exposed and how. DRF's generic views mean I
describe intent, not plumbing:

```python
class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    def get_queryset(self):
        return Post.objects.filter(status="published").order_by("-created_at")


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    lookup_field = "slug"                       # look posts up by slug, not id
    def get_queryset(self):
        return Post.objects.filter(status="published")
```

`ListCreateAPIView` gives me `GET` (list) and `POST` (create) for free;
`RetrieveAPIView` gives me `GET` one. Because both querysets filter to
`published`, **drafts are invisible to the API by construction** — there's no way to
accidentally leak one, because the query never selects them.

Finally, wire the URLs:

```python
# blog/urls.py
urlpatterns = [
    path("posts/", views.PostListView.as_view(), name="post-list"),
    path("posts/<slug:slug>/", views.PostDetailView.as_view(), name="post-detail"),
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
]
```

And I had a JSON API: `GET /api/posts/` returned my posts, `GET /api/posts/<slug>/`
returned one. I tested it with the browser and `curl` before the frontend ever
touched it.

## CORS: the first "why isn't this working"

The frontend (`localhost:3000`) and backend (`localhost:8000`) are different
origins, so the browser blocked the requests until I told Django which origins to
trust:

```python
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"]
)
```

Reading it from the environment meant production could allow a different origin
without a code change. This is the kind of thing that's obvious *after* you've spent
twenty minutes staring at a blocked request in the network tab.

## What I'd tell past me

- **Spend your time on the models.** Get the fields, relationships, and
  `on_delete` behaviour right; the API is a thin layer on top.
- **A `status` field is worth more than it looks.** Draft/published gave me safe
  authoring and defined every public query.
- **Filter drafts in the queryset, not the view logic.** If the query can't select
  it, you can't leak it.
- **Let DRF's generic views do the work.** Describe *what* is exposed; don't
  hand-roll request parsing.
- **The Django admin is a real feature.** For content, it's a CMS you get for free.

Next: connecting Next.js to this API with a typed client, rendering markdown posts —
and then the part that took the longest, authentication.

*Next: [Wiring It Together: Markdown and Auth →](./part-3-wiring-it-together-markdown-and-auth.md)*
