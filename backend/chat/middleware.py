from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from django.contrib.auth import get_user_model
import jwt


@database_sync_to_async
def get_user(scope):
    """
    This fucntion retrieves the user associated with the token from the request scope
    """
    token = scope['token']
    model = get_user_model()  # Get the custom user model defined in django settings

    try:
        # If token is provided, decode it and retrieve the user id from the payload
        if token:
            user_id = jwt.decode(token, settings.SECRET_KEY,
                                 algorithms=['HS256'])['user_id']
            # return the user object
            return model.objects.get(id=user_id)
        else:
            return AnonymousUser()
    except (jwt.exceptions.DecodeError, model.DoesNotExist):
        return AnonymousUser()


class JWTMiddleware():
    """
    Custom middleware class to handle JWT authentication for WebSocket connections
    """

    def __init__(self, app):
        self.app = app

    # __call__ method is called for each incoming websocket request
    async def __call__(self, scope, recieve, send):
        # Extract headers from the scope and parse the cookies from the cookie header
        headers_dict = dict(scope['headers'])
        cookies_str = headers_dict.get(b'cookie', b'').decode()

        cookies = {}
        for cookie in cookies_str.split('; '):
            if '=' in cookie:
                k, v = cookie.split('=', 1)
                cookies[k] = v
        access_token = cookies.get('access_token')

        # Add the token to the scope so that it can be used by other parts of the application
        scope['token'] = access_token
        # Retrieve the user associated with the token and add it to the scope
        scope['user'] = await get_user(scope)

        return await self.app(scope, recieve, send)
