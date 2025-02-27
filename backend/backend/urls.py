from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from server.views import ServerViewSet, CategoryViewSet, MembershipViewSet, UserServers, ServerManagement, CategoryCreation, ChannelManagement
from chat.consumers import ChatConsumer
from chat.views import MessageViewSet
from users.views import ObtainJWTWithCookiesView, RefreshJWTWithCookiesView, Logout, RegisterUser, UserManagement

router = DefaultRouter()
router.register('api/server/select', ServerViewSet)
router.register('api/server/category', CategoryViewSet)
router.register('api/messages', MessageViewSet, basename='messages')
router.register(r'api/server/(?P<server_id>\d+)/membership',
                MembershipViewSet, basename='membership')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/docs/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/schema/ui/', SpectacularSwaggerView.as_view()),
    path('api/token/', ObtainJWTWithCookiesView.as_view(),
         name='token_obtain_pair'),
    path('api/token/refresh/', RefreshJWTWithCookiesView.as_view(),
         name='token_refresh'),
    path('api/logout/', Logout.as_view(), name='logout'),
    path('api/sign-up/', RegisterUser.as_view(), name='sign-up'),
    path('api/users/user-management/',
         UserManagement.as_view(), name='user-management'),
    path('api/servers/user/', UserServers.as_view(), name='user-servers'),
    path('api/servers/category/', CategoryCreation.as_view(),
         name='category-management'),
    path('api/servers/channel/', ChannelManagement.as_view(), name='create-channel'),
    path('api/servers/channel/<str:pk>/delete/',
         ChannelManagement.as_view(), name='channel-delete'),
    path('api/servers/management/',
         ServerManagement.as_view(), name='server-management'),
    path('api/servers/<str:pk>/',
         ServerManagement.as_view(), name='server-get'),
    path('api/servers/<str:pk>/delete/',
         ServerManagement.as_view(), name='server-delete'),
    path('api/servers/<str:pk>/edit/',
         ServerManagement.as_view(), name='server-edit'),


] + router.urls

websockets_urls = [
    path('<str:serverId>/<str:channelId>', ChatConsumer.as_asgi())]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
