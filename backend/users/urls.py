from django.urls import path
from users.views import (
    ObtainJWTWithCookiesView, RefreshJWTWithCookiesView, Logout,
    RegisterUser, UserManagement, PublicProfile
)

urlpatterns = [
    path('token/', ObtainJWTWithCookiesView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', RefreshJWTWithCookiesView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('sign-up/', RegisterUser.as_view(), name='sign-up'),
    path('users/user-management/', UserManagement.as_view(), name='user-management'),
    path('users/<str:user_id>/', PublicProfile.as_view(), name='profile'),
]
