from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from chat.consumers import ChatConsumer
from chat.views import MessageViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('api/messages', MessageViewSet, basename='messages')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/schema/ui/', SpectacularSwaggerView.as_view()),
    path('api/', include('users.urls')),
    path('api/', include('server.urls')),
] + router.urls


websockets_urls = [
    path('<str:serverId>/<str:channelId>', ChatConsumer.as_asgi()),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
