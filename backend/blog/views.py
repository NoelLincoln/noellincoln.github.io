from rest_framework import generics

from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(status="published").order_by("-created_at")


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Post.objects.filter(status="published")


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
