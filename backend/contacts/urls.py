from django.urls import path
from django.contrib.auth import views as auth_views
from . import views_new

# Modern RESTful API endpoints
urlpatterns = [
    # Contact API endpoints
    path('', views_new.ContactCreateAPIView.as_view(), name='contact-create'),
    path('list/', views_new.ContactListAPIView.as_view(), name='contact-list'),
    path('<int:id>/', views_new.ContactDetailAPIView.as_view(), name='contact-detail'),
    path('user-contacts/', views_new.user_contacts, name='user-contacts'),
    
    # Legacy password reset (keep existing)
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]