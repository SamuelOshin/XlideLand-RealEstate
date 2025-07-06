from django.urls import path
from . import views

app_name = 'realtors'

urlpatterns = [
    # API Endpoints
    path('', views.RealtorListAPIView.as_view(), name='realtor-list'),
    path('<int:id>/', views.RealtorDetailAPIView.as_view(), name='realtor-detail'),
    path('create/', views.RealtorCreateAPIView.as_view(), name='realtor-create'),
    path('<int:id>/update/', views.RealtorUpdateAPIView.as_view(), name='realtor-update'),
    path('<int:id>/delete/', views.RealtorDeleteAPIView.as_view(), name='realtor-delete'),
    path('mvp/', views.mvp_realtors, name='mvp-realtors'),
    
    # Legacy endpoints (for backwards compatibility)
    path('legacy/', views.index, name='legacy-index'),
]
