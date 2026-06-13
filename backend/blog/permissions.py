from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsStaffOrReadOnly(BasePermission):
    """
    Anyone can read (GET, HEAD, OPTIONS).
    Only staff users can write (POST, PUT, PATCH, DELETE).
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user and request.user.is_authenticated and request.user.is_staff
        )
