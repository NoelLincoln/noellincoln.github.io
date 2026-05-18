import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_post_list_returns_200(client):
    response = client.get(reverse("post-list"))
    assert response.status_code == 200


@pytest.mark.django_db
def test_category_list_returns_200(client):
    response = client.get(reverse("category-list"))
    assert response.status_code == 200
