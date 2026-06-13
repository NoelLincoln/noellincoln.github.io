import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken


def auth_header(user):
    refresh = RefreshToken.for_user(user)
    return {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}


# ── Read endpoints ────────────────────────────────────────────────────────────


@pytest.mark.django_db
def test_post_list_returns_200(client):
    response = client.get(reverse("post-list"))
    assert response.status_code == 200


@pytest.mark.django_db
def test_category_list_returns_200(client):
    response = client.get(reverse("category-list"))
    assert response.status_code == 200


# ── Write permissions ─────────────────────────────────────────────────────────


@pytest.mark.django_db
def test_post_create_requires_auth(client):
    """Unauthenticated POST returns 401."""
    response = client.post(
        reverse("post-list"),
        {"title": "T", "slug": "t", "body": "b", "status": "draft"},
        content_type="application/json",
    )
    assert response.status_code == 401


@pytest.mark.django_db
def test_post_create_forbidden_for_non_staff(client):
    """Authenticated but non-staff POST returns 403."""
    user = User.objects.create_user(username="reader", password="pass", is_staff=False)
    response = client.post(
        reverse("post-list"),
        {"title": "T", "slug": "t", "body": "b", "status": "draft"},
        content_type="application/json",
        **auth_header(user),
    )
    assert response.status_code == 403


@pytest.mark.django_db
def test_post_create_allowed_for_staff(client):
    """Staff POST creates and returns 201."""
    user = User.objects.create_user(username="author", password="pass", is_staff=True)
    response = client.post(
        reverse("post-list"),
        {"title": "Hello", "slug": "hello", "body": "World", "status": "draft"},
        content_type="application/json",
        **auth_header(user),
    )
    assert response.status_code == 201


# ── Token endpoint returns is_staff ──────────────────────────────────────────


@pytest.mark.django_db
def test_token_response_includes_is_staff_false(client):
    User.objects.create_user(username="reader", password="pass123", is_staff=False)
    response = client.post(
        reverse("token_obtain_pair"),
        {"username": "reader", "password": "pass123"},
        content_type="application/json",
    )
    assert response.status_code == 200
    assert response.json()["is_staff"] is False


@pytest.mark.django_db
def test_token_response_includes_is_staff_true(client):
    User.objects.create_user(username="author", password="pass123", is_staff=True)
    response = client.post(
        reverse("token_obtain_pair"),
        {"username": "author", "password": "pass123"},
        content_type="application/json",
    )
    assert response.status_code == 200
    assert response.json()["is_staff"] is True
