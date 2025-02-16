from django.conf import settings
from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'profile_image',
                  'last_login', 'date_joined', )


class CustomTokenObtainPariSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token obtain serializer that adds extra information to the token
    """
    def get_token(cls, user):
        # Override the default method to include the user_id in the token payload
        token = super().get_token(user)
        token['user_id'] = user.id
        return token

    # Add aditional data to the response
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id

        return data


class JWTCookieTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Custom serializer for refreshing JWT tokens from cookies
    """
    refresh = None

    def validate(self, attrs):
        # Validate the refresh token from the request cookies
        attrs['refresh'] = self.context['request'].COOKIES.get(
            settings.SIMPLE_JWT['REFRESH_TOKEN_NAME'])
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid refresh token was found')


class RegisterSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image']
