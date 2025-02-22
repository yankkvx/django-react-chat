from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, CustomTokenObtainPariSerializer, JWTCookieTokenRefreshSerializer, RegisterSerializer
from .schema import user_docs, logout_docs, register_docs
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
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


class RegisterUser(SetJWTInCookiesMixin, APIView):
    """
    View to handle user registration
    Accepts a POST request with the user data and profile image,
    performs validation to ensure unique email and username,
    and creates a new user if all validations pass
    """
    @register_docs
    def post(self, request):
        # Get the data from the request
        data = request.data
        profile_image = request.FILES.get('profile_image')

        # Check if the email is already taken
        if User.objects.filter(email=data['email']).exists():
            return Response({'detail': 'This email is already associated with an account.'}, status=status.HTTP_409_CONFLICT)

        # Check if the email is already taken
        if User.objects.filter(username=data['username']).exists():
            return Response({'detail': 'This username is already taken.'}, status=status.HTTP_409_CONFLICT)

        # Validate that the password is at least 8 characters long
        if len(data['password']) < 8:
            return Response({'detail': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure the password does not contain spaces
        if ' ' in data['password']:
            return Response({'detail': 'Password cannot contain spaces.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user if validation passes
        try:
            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                profile_image=profile_image,
                password=make_password(data['password']),
            )

            refresh_token = RefreshToken.for_user(user)
            access_token = str(refresh_token.access_token)

            serializer = RegisterSerializer(user, many=False)
            response = Response(
                serializer.data, status=status.HTTP_201_CREATED)

            response.data['access'] = access_token
            response.data['refresh'] = str(refresh_token)
            return self.finalize_response(request, response)

        except Exception as e:
            return Response({'detail': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserManagement(APIView):
    """
    View to handle user management operations
    Its fetching the current user's data and updating 
    the user's profile (including username, email, etc)
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user
        data = request.data
        # Flag to check if a refresh of tokens is needed (when email or password changes)
        refresh_needed = False

        # Get the new email from the request, defaulting to the current users email
        new_email = data.get('email', user.email)
        # Get the raw password from the request, defaulting to an empty string
        new_password_raw = data.get('password', '')

        try:
            # If a new email is provided and its different from the current email, update it
            if new_email and new_email != user.email:
                refresh_needed = True  # Mark for refresh as email is updated
                user.email = new_email

            # If a new password is provided check if its different from the current one
            if new_password_raw:
                # Only update the password if the new one doesn't match the current one
                if not user.check_password(new_password_raw):
                    refresh_needed = True  # Mark for refresh as password is updated
                    user.password = make_password(new_password_raw)

            # If the new username is different, update the users username
            if data.get('username') != user.username:
                user.username = data.get('username', user.username)
            # If the new profile image is different, update the users profile image
            if data.get('profile_image') != user.profile_image:
                user.profile_image = data.get(
                    'profile_image', user.profile_image)

            user.save()

            response = Response(
                {'detail': 'Profile updated successfully'}, status=status.HTTP_200_OK
            )

            # If the email or password has changed, refresh the JWT tokens
            if refresh_needed:
                # Generate a new refresh token for the user
                refresh = RefreshToken.for_user(user)
                # Extract the new access token from the refresh token
                access_token = str(refresh.access_token)

                # Set the new access token in an HTTP-only cookie
                response.set_cookie(
                    key=settings.SIMPLE_JWT['ACCESS_TOKEN_NAME'],
                    value=access_token,
                    httponly=True,
                    samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
                )

                # Set the new refresh token in an HTTP-only cookie
                response.set_cookie(
                    key=settings.SIMPLE_JWT['REFRESH_TOKEN_NAME'],
                    value=str(refresh),
                    httponly=True,
                    samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
                )

            # Return the response with a success message
            return response

        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
