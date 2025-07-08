from django.urls import path
from . import views

app_name = 'listings'

urlpatterns = [
    # API Endpoints
    path('', views.ListingListAPIView.as_view(), name='listing-list'),
    path('<int:id>/', views.ListingDetailAPIView.as_view(), name='listing-detail'),
    path('create/', views.ListingCreateAPIView.as_view(), name='listing-create'),
    path('<int:id>/update/', views.ListingUpdateAPIView.as_view(), name='listing-update'),
    path('<int:id>/delete/', views.ListingDeleteAPIView.as_view(), name='listing-delete'),
    path('featured/', views.FeaturedListingsAPIView.as_view(), name='featured-listings-paginated'),
    path('featured/legacy/', views.featured_listings, name='featured-listings-legacy'),
    path('search/', views.SearchListingsAPIView.as_view(), name='search-listings-paginated'),
    path('search/legacy/', views.search_listings, name='search-listings-legacy'),
    
    # Admin Moderation Endpoints
    path('admin/moderation/', views.PropertyModerationListAPIView.as_view(), name='moderation-list'),
    path('admin/moderation/<int:id>/', views.PropertyModerationDetailAPIView.as_view(), name='moderation-detail'),
    path('admin/moderation/<int:moderation_id>/approve/', views.approve_property, name='approve-property'),
    path('admin/moderation/<int:moderation_id>/reject/', views.reject_property, name='reject-property'),
    path('admin/moderation/<int:moderation_id>/flag/', views.flag_property, name='flag-property'),
    
    # Legacy endpoints (for backwards compatibility)
    path('legacy/', views.index, name='legacy-index'),
    path('legacy/<int:listing_id>/', views.listing, name='legacy-listing'),
    path('legacy/search/', views.search, name='legacy-search'),
]
