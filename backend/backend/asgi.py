import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django_asgi_app = get_asgi_application()

from . import urls  # noqa isort:skip
from chat.middleware import JWTMiddleware # noqa isort:skip

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JWTMiddleware(URLRouter(urls.websockets_urls))
})
