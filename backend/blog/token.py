from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class LoginRateThrottle(AnonRateThrottle):
    """
    Separate throttle scope for the login endpoint so we can cap it
    tightly (5 attempts/minute) without restricting other anonymous reads.
    """

    scope = "login"


class StaffClaimTokenSerializer(TokenObtainPairSerializer):
    """
    Adds is_staff to the token response so the frontend can gate
    write actions without needing a separate profile endpoint.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        data["is_staff"] = self.user.is_staff
        return data


class StaffTokenObtainPairView(TokenObtainPairView):
    serializer_class = StaffClaimTokenSerializer
    throttle_classes = [LoginRateThrottle]
