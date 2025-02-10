from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


# Custom JWT authentication class that reads the token from cookies
class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom authentication class that retrieves the access token from cookies.
    """

    def authenticate(self, request):
        # Retrieve the access token from cookies
        raw_token = request.COOKIES.get(
            settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"]) or None

        # if no token found, return None
        if raw_token is None:
            return None

        # Validate and decode the toke
        validated_token = self.get_validated_token(raw_token)
        # Return the user and the validated token
        return self.get_user(validated_token), validated_token
