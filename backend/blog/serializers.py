from rest_framework import serializers

from .models import Category, Comment, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "author_name", "body", "like_count", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_like_count(self, obj):
        return obj.likes.count()


class PostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "body",
            "category",
            "category_id",
            "status",
            "published_at",
            "created_at",
        ]
