from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from server.views import ServerViewSet, CategoryViewSet
from chat.consumers import ChatConsumer
from chat.views import MessageViewSet
from users.views import UserViewSet, ObtainJWTWithCookiesView, RefreshJWTWithCookiesView


router = DefaultRouter()
router.register('api/server/select', ServerViewSet)
router.register('api/server/category', CategoryViewSet)
router.register('api/messages', MessageViewSet, basename='messages')
router.register('api/user', UserViewSet, basename='user')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/schema/ui/', SpectacularSwaggerView.as_view()),
    path('api/token/', ObtainJWTWithCookiesView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/', RefreshJWTWithCookiesView.as_view(),
         name='token_refresh'),
] + router.urls

websockets_urls = [
    path('<str:serverId>/<str:channelId>', ChatConsumer.as_asgi())]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
