from django.urls import path

from . import views
from .auth_views import RegisterView, SocialAuthView

urlpatterns = [
    path("posts/", views.PostListView.as_view(), name="post-list"),
    path("posts/<slug:slug>/", views.PostDetailView.as_view(), name="post-detail"),
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/social/", SocialAuthView.as_view(), name="social-auth"),
]
