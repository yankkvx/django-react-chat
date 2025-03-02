from django.urls import path
from rest_framework.routers import DefaultRouter
from server.views import (
    ServerViewSet, CategoryViewSet, MembershipViewSet,
    UserServers, ServerManagement, CategoryCreation, ChannelManagement
)

router = DefaultRouter()
router.register('server/select', ServerViewSet)
router.register('server/category', CategoryViewSet)
router.register(r'server/(?P<server_id>\d+)/membership',
                MembershipViewSet, basename='membership')

urlpatterns = [
    path('servers/user/', UserServers.as_view(), name='user-servers'),
    path('servers/category/', CategoryCreation.as_view(),
         name='category-management'),
    path('servers/channel/', ChannelManagement.as_view(), name='create-channel'),
    path('servers/channel/<str:pk>/delete/',
         ChannelManagement.as_view(), name='channel-delete'),
    path('servers/management/', ServerManagement.as_view(),
         name='server-management'),
    path('servers/<str:pk>/', ServerManagement.as_view(), name='server-get'),
    path('servers/<str:pk>/delete/',
         ServerManagement.as_view(), name='server-delete'),
    path('servers/<str:pk>/edit/', ServerManagement.as_view(), name='server-edit'),
    path('servers/<str:server_id>/user/<str:user_id>/',
         UserServers.as_view(), name='remove-user'),
]

urlpatterns += router.urls
