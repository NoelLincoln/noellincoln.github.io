from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"username": user.username, "email": user.email},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SocialAuthView(APIView):
    """
    Called server-side by NextAuth after a successful Google sign-in.
    Finds or creates a Django user for that Google account and returns
    a JWT pair so the frontend can make authenticated API calls.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        name = request.data.get("name", "")

        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        # Derive a username from the email local part, avoiding conflicts
        base = email.split("@")[0]
        username = base
        counter = 1
        while User.objects.filter(username=username).exclude(email=email).exists():
            username = f"{base}{counter}"
            counter += 1

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": name.split(" ")[0] if name else "",
            },
        )

        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_200_OK,
        )
