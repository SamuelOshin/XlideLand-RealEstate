from django.urls import path
from django.contrib.auth import views as auth_views
from . import views_new


from . import views
from . import views_new

urlpatterns = [
    # Modern REST API endpoints
    path('api/contacts/', views_new.ContactCreateAPIView.as_view(), name='contact-create-api'),
    path('api/contacts/list/', views_new.ContactListAPIView.as_view(), name='contact-list-api'),
    path('api/contacts/<int:id>/', views_new.ContactDetailAPIView.as_view(), name='contact-detail-api'),
    path('api/contacts/user/', views_new.user_contacts, name='user-contacts-api'),
    path('api/contacts/stats/', views_new.contact_stats, name='contact-stats-api'),
    
    # Legacy endpoints for backwards compatibility
    path('contact', views.contact, name='contact'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]