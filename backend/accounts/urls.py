from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'accounts'

# Create router for ViewSets
router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')
router.register(r'favorites', views.UserFavoriteViewSet, basename='userfavorite')
router.register(r'tours', views.TourViewSet, basename='tour')
router.register(r'conversations', views.ConversationViewSet, basename='conversation')
router.register(r'notifications', views.NotificationViewSet, basename='notification')
router.register(r'alerts', views.PropertyAlertViewSet, basename='propertyalert')
router.register(r'documents', views.DocumentViewSet, basename='document')
router.register(r'activities', views.UserActivityViewSet, basename='useractivity')
router.register(r'admin/users', views.AdminUserManagementViewSet, basename='admin-users')

urlpatterns = [
    # =================== AUTHENTICATION ENDPOINTS ===================
    path('register/', views.UserRegistrationAPIView.as_view(), name='user-register'),
    path('admin/register/', views.AdminUserRegistrationAPIView.as_view(), name='admin-user-register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='user-login'),
    path('profile/', views.UserProfileAPIView.as_view(), name='user-profile'),
    path('profile/update/', views.UserUpdateAPIView.as_view(), name='user-update'),
    path('change-password/', views.change_password, name='change-password'),
    
    # =================== DASHBOARD ENDPOINTS ===================
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('dashboard/analytics/', views.user_analytics, name='user-analytics'),
    
    # =================== COMMUNICATION ENDPOINTS ===================
    path('conversations/start/', views.start_conversation, name='start-conversation'),
    
    # =================== UTILITY ENDPOINTS ===================
    path('log-activity/', views.log_user_activity, name='log-activity'),
    path('search-users/', views.search_users, name='search-users'),
    
    # =================== VIEWSET ENDPOINTS ===================
    path('', include(router.urls)),
    
    # =================== LEGACY ENDPOINTS ===================
    # Kept for backwards compatibility with existing templates
    path('legacy/login/', views.login, name='legacy-login'),
    path('legacy/register/', views.register, name='legacy-register'),
    path('legacy/logout/', views.logout, name='legacy-logout'),
    path('legacy/dashboard/', views.dashboard, name='legacy-dashboard'),
]
