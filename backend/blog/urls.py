from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
]
