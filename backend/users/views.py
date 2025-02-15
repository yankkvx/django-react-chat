from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, CustomTokenObtainPariSerializer, JWTCookieTokenRefreshSerializer
from .schema import user_docs, logout_docs
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
# Create your views here.


class SetJWTInCookiesMixin:
    """
    Mixin for setting JWT tokens as cookies in the response
    This allow the tokens to be stored in the browser cookies for next requests
    """

    def finalize_response(self, request, response, *args, **kwargs):
        # If a refresh token is included in the response set is a cookie
        if response.data.get("refresh"):
            response.set_cookie(
                settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"],
                response.data["refresh"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,  # Cookie is only accessible via http, not js
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
        # If a access token is included in the response set is a cookie
        if response.data.get("access"):
            response.set_cookie(
                settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"],
                response.data["access"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["access"]

        return super().finalize_response(request, response, *args, **kwargs)


class ObtainJWTWithCookiesView(SetJWTInCookiesMixin, TokenObtainPairView):
    """
    View for obtaining JWT tokens
    The tokens are set as cookies to be used for authentication in next requests.
    """
    serializer_class = CustomTokenObtainPariSerializer


class RefreshJWTWithCookiesView(SetJWTInCookiesMixin, TokenRefreshView):
    """
    View for refreshing JWT tokens
    The refreshed tokens are set as cookies for authentication
    """
    serializer_class = JWTCookieTokenRefreshSerializer


class UserViewSet(viewsets.ViewSet):
    """
    Viewset for managing user details
    Accessible only for authenticated users
    """
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    @user_docs
    def list(self, request):
        user = request.user
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)


class Logout(APIView):
    """
    View to log out the user by deleting JWT cookies
    """
    @logout_docs
    def post(self, request):

        refresh_token = request.COOKIES.get(
            settings.SIMPLE_JWT['REFRESH_TOKEN_NAME'])
        access_token = request.COOKIES.get(
            settings.SIMPLE_JWT['ACCESS_TOKEN_NAME'])

        if not refresh_token and not access_token:
            return Response({'detail': 'No active session found to log out.'}, status=status.HTTP_400_BAD_REQUEST)

        response = Response({'detail': 'Successfully logged out'},
                            status=status.HTTP_204_NO_CONTENT)

        response.delete_cookie(settings.SIMPLE_JWT['REFRESH_TOKEN_NAME'])
        response.delete_cookie(settings.SIMPLE_JWT['ACCESS_TOKEN_NAME'])
        return response
