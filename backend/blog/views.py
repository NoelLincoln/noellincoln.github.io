from rest_framework import generics, views
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Category, Comment, Post
from .permissions import IsStaffOrReadOnly
from .serializers import CategorySerializer, CommentSerializer, PostSerializer


class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        return Post.objects.filter(status="published").order_by("-created_at")


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Post.objects.filter(status="published")


class CategoryListView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    permission_classes = [IsStaffOrReadOnly]


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post__slug=self.kwargs["slug"]).order_by(
            "created_at"
        )

    def perform_create(self, serializer):
        post = get_object_or_404(Post, slug=self.kwargs["slug"])
        serializer.save(post=post, author=self.request.user)


class CommentLikeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug, pk):
        comment = get_object_or_404(Comment, pk=pk, post__slug=slug)
        if request.user in comment.likes.all():
            comment.likes.remove(request.user)
            liked = False
        else:
            comment.likes.add(request.user)
            liked = True
        return Response({"like_count": comment.likes.count(), "liked": liked})
