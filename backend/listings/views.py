from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Listing, PropertyModeration
from .serializers import (
    ListingSerializer, 
    ListingListSerializer, 
    ListingCreateSerializer, 
    ListingUpdateSerializer,
    PropertyModerationSerializer, 
    PropertyModerationUpdateSerializer
)


class CustomPagination(PageNumberPagination):
    """
    Custom pagination class for property listings
    """
    page_size = 12  # Default listings per page
    page_size_query_param = 'limit'
    max_page_size = 100
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'results': data,
            'count': self.page.paginator.count,
            'pagination': {
                'page': self.page.number,
                'limit': self.page_size,
                'total': self.page.paginator.count,
                'pages': self.page.paginator.num_pages,
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
                'next_page': self.page.next_page_number() if self.page.has_next() else None,
                'previous_page': self.page.previous_page_number() if self.page.has_previous() else None,
            }
        })


class FeaturedListingsPagination(PageNumberPagination):
    """
    Custom pagination class for featured listings
    """
    page_size = 6  # Default 6 featured listings per page
    page_size_query_param = 'limit'
    max_page_size = 20
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'results': data,
            'count': self.page.paginator.count,
            'pagination': {
                'page': self.page.number,
                'limit': self.page_size,
                'total': self.page.paginator.count,
                'pages': self.page.paginator.num_pages,
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
                'next_page': self.page.next_page_number() if self.page.has_next() else None,
                'previous_page': self.page.previous_page_number() if self.page.has_previous() else None,
            }
        })


class SearchListingsPagination(PageNumberPagination):
    """
    Custom pagination class for search results
    """
    page_size = 15  # Default 15 search results per page
    page_size_query_param = 'limit'
    max_page_size = 50
    page_query_param = 'page'

    def get_paginated_response(self, data):
        return Response({
            'results': data,
            'count': self.page.paginator.count,
            'pagination': {
                'page': self.page.number,
                'limit': self.page_size,
                'total': self.page.paginator.count,
                'pages': self.page.paginator.num_pages,
                'has_next': self.page.has_next(),
                'has_previous': self.page.has_previous(),
                'next_page': self.page.next_page_number() if self.page.has_next() else None,
                'previous_page': self.page.previous_page_number() if self.page.has_previous() else None,
            }
        })


class ListingListAPIView(generics.ListAPIView):
    """
    List all published listings with search, filter, and pagination capabilities
    """
    queryset = Listing.objects.filter(is_published=True).order_by('-list_date')
    serializer_class = ListingListSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'state', 'bedrooms', 'bathrooms', 'realtor', 'is_featured']
    search_fields = ['title', 'description', 'address', 'city', 'state']
    ordering_fields = ['price', 'list_date', 'sqft']
    ordering = ['-list_date']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Custom filters
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        min_sqft = self.request.query_params.get('min_sqft')
        max_sqft = self.request.query_params.get('max_sqft')
        property_type = self.request.query_params.get('property_type')
        listing_type = self.request.query_params.get('listing_type')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if min_sqft:
            queryset = queryset.filter(sqft__gte=min_sqft)
        if max_sqft:
            queryset = queryset.filter(sqft__lte=max_sqft)
        if property_type:
            queryset = queryset.filter(property_type=property_type)
        if listing_type:
            queryset = queryset.filter(listing_type=listing_type)
            
        return queryset


class ListingDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve a specific listing by ID
    """
    queryset = Listing.objects.filter(is_published=True)
    serializer_class = ListingSerializer
    lookup_field = 'id'


class ListingCreateAPIView(generics.CreateAPIView):
    """
    Create a new listing (authenticated users only)
    """
    queryset = Listing.objects.all()
    serializer_class = ListingCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # You can add custom logic here, e.g., setting the realtor based on the user
        serializer.save()


class ListingUpdateAPIView(generics.UpdateAPIView):
    """
    Update an existing listing (authenticated users only)
    """
    queryset = Listing.objects.all()
    serializer_class = ListingUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class ListingDeleteAPIView(generics.DestroyAPIView):
    """
    Delete a listing (authenticated users only)
    """
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class FeaturedListingsAPIView(generics.ListAPIView):
    """
    Get featured listings with pagination
    """
    serializer_class = ListingListSerializer
    pagination_class = FeaturedListingsPagination
    
    def get_queryset(self):
        # Get listings marked as featured first, then MVP realtors, then latest
        featured_queryset = Listing.objects.filter(
            is_published=True,
            is_featured=True
        ).order_by('-list_date')
        
        if featured_queryset.count() < 6:
            # If not enough featured listings, add MVP realtor listings
            mvp_queryset = Listing.objects.filter(
                is_published=True,
                realtor__is_mvp=True
            ).exclude(is_featured=True).order_by('-list_date')
            
            # Combine querysets
            combined_ids = list(featured_queryset.values_list('id', flat=True)) + \
                          list(mvp_queryset.values_list('id', flat=True))
            
            if len(combined_ids) < 6:
                # If still not enough, add latest listings
                latest_queryset = Listing.objects.filter(
                    is_published=True
                ).exclude(id__in=combined_ids).order_by('-list_date')
                
                combined_ids.extend(list(latest_queryset.values_list('id', flat=True)))
            
            # Return queryset preserving order
            return Listing.objects.filter(id__in=combined_ids).order_by('-list_date')
        
        return featured_queryset


@api_view(['GET'])
def featured_listings(request):
    """
    Legacy featured listings endpoint - kept for backward compatibility
    """
    try:
        # Get listings from MVP realtors or latest 6 listings
        featured = Listing.objects.filter(
            is_published=True,
            is_featured=True
        ).order_by('-list_date')[:6]
        
        if featured.count() < 6:
            # If not enough featured listings, get MVP listings
            mvp_featured = Listing.objects.filter(
                is_published=True,
                realtor__is_mvp=True
            ).exclude(is_featured=True).order_by('-list_date')[:6-featured.count()]
            
            # Combine results
            all_featured = list(featured) + list(mvp_featured)
            
            if len(all_featured) < 6:
                # If still not enough, get latest listings
                latest = Listing.objects.filter(
                    is_published=True
                ).exclude(
                    id__in=[listing.id for listing in all_featured]
                ).order_by('-list_date')[:6-len(all_featured)]
                
                all_featured.extend(list(latest))
            
            serializer = ListingListSerializer(all_featured, many=True)
        else:
            serializer = ListingListSerializer(featured, many=True)
            
        return Response({
            'results': serializer.data,
            'count': len(serializer.data)
        })
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch featured listings'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class SearchListingsAPIView(generics.ListAPIView):
    """
    Advanced search for listings with pagination
    """
    serializer_class = ListingListSerializer
    pagination_class = SearchListingsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'state', 'bedrooms', 'bathrooms', 'realtor', 'is_featured', 'property_type', 'listing_type']
    search_fields = ['title', 'description', 'address', 'city', 'state']
    ordering_fields = ['price', 'list_date', 'sqft']
    ordering = ['-list_date']

    def get_queryset(self):
        queryset = Listing.objects.filter(is_published=True)
        
        # Custom filters
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        min_sqft = self.request.query_params.get('min_sqft')
        max_sqft = self.request.query_params.get('max_sqft')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if min_sqft:
            queryset = queryset.filter(sqft__gte=min_sqft)
        if max_sqft:
            queryset = queryset.filter(sqft__lte=max_sqft)
            
        return queryset.order_by('-list_date')


@api_view(['GET'])
def search_listings(request):
    """
    Legacy search endpoint - kept for backward compatibility
    """
    try:
        query = request.GET.get('q', '')
        city = request.GET.get('city', '')
        state = request.GET.get('state', '')
        bedrooms = request.GET.get('bedrooms', '')
        price_max = request.GET.get('price_max', '')
        
        listings = Listing.objects.filter(is_published=True)
        
        if query:
            listings = listings.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(address__icontains=query) |
                Q(city__icontains=query) |
                Q(state__icontains=query)
            )
        
        if city:
            listings = listings.filter(city__iexact=city)
        
        if state:
            listings = listings.filter(state__iexact=state)
        
        if bedrooms:
            listings = listings.filter(bedrooms__gte=bedrooms)
        
        if price_max:
            listings = listings.filter(price__lte=price_max)
        
        listings = listings.order_by('-list_date')
        serializer = ListingListSerializer(listings, many=True)
        return Response({
            'results': serializer.data,
            'count': listings.count()
        })
    
    except Exception as e:
        return Response(
            {'error': 'Search failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Property Moderation Views (Admin only)
class PropertyModerationListAPIView(generics.ListAPIView):
    """
    List all properties pending moderation (Admin only)
    """
    queryset = PropertyModeration.objects.all().order_by('-priority', '-submitted_date')
    serializer_class = PropertyModerationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority']
    search_fields = ['listing__title', 'listing__address', 'listing__city']
    ordering_fields = ['submitted_date', 'priority', 'status']
    ordering = ['-priority', '-submitted_date']


class PropertyModerationDetailAPIView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update property moderation status (Admin only)
    """
    queryset = PropertyModeration.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PropertyModerationUpdateSerializer
        return PropertyModerationSerializer
    
    def perform_update(self, serializer):
        # Set the reviewing admin
        serializer.save(reviewed_by=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def approve_property(request, moderation_id):
    """
    Approve a property and publish it
    """
    try:
        moderation = PropertyModeration.objects.get(id=moderation_id)
        moderation.status = 'approved'
        moderation.reviewed_by = request.user
        moderation.reviewed_date = timezone.now()
        moderation.save()
        
        # Publish the listing
        moderation.listing.is_published = True
        moderation.listing.save()
        
        return Response({'message': 'Property approved and published'}, status=status.HTTP_200_OK)
    except PropertyModeration.DoesNotExist:
        return Response({'error': 'Moderation record not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def reject_property(request, moderation_id):
    """
    Reject a property with reason
    """
    try:
        moderation = PropertyModeration.objects.get(id=moderation_id)
        reason = request.data.get('reason', '')
        
        moderation.status = 'rejected'
        moderation.reason = reason
        moderation.reviewed_by = request.user
        moderation.reviewed_date = timezone.now()
        moderation.save()
        
        # Unpublish the listing
        moderation.listing.is_published = False
        moderation.listing.save()
        
        return Response({'message': 'Property rejected'}, status=status.HTTP_200_OK)
    except PropertyModeration.DoesNotExist:
        return Response({'error': 'Moderation record not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def flag_property(request, moderation_id):
    """
    Flag a property for review with reason
    """
    try:
        moderation = PropertyModeration.objects.get(id=moderation_id)
        reason = request.data.get('reason', '')
        
        moderation.status = 'flagged'
        moderation.reason = reason
        moderation.reviewed_by = request.user
        moderation.reviewed_date = timezone.now()
        moderation.priority = 'high'  # Flagged items get high priority
        moderation.save()
        
        # Keep the listing published but flagged for further review
        # moderation.listing.is_published can remain True
        
        return Response({'message': 'Property flagged for review'}, status=status.HTTP_200_OK)
    except PropertyModeration.DoesNotExist:
        return Response({'error': 'Moderation record not found'}, status=status.HTTP_404_NOT_FOUND)


# Legacy Django views for backwards compatibility (if needed)
from django.shortcuts import get_object_or_404, render
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from .choices import price_choices, bedroom_choices, state_choices

def index(request):
    """Legacy Django view - kept for backwards compatibility"""
    listings = Listing.objects.order_by('-list_date').filter(is_published=True)
    paginator = Paginator(listings, 3)
    page = request.GET.get('page')
    paged_listings = paginator.get_page(page)

    context = {
        'listings': paged_listings
    }

    return render(request, 'listings/listings.html', context)

def listing(request, listing_id):
    """Legacy Django view - kept for backwards compatibility"""
    listing = get_object_or_404(Listing, pk=listing_id)

    context = {
        'listing': listing
    }

    return render(request, 'listings/listing.html', context)

def search(request):
    """Legacy Django view - kept for backwards compatibility"""
    queryset_list = Listing.objects.order_by('-list_date')

    # Keywords
    if 'keywords' in request.GET:
        keywords = request.GET['keywords']
        if keywords:
            queryset_list = queryset_list.filter(description__icontains=keywords)

    # City
    if 'city' in request.GET:
        city = request.GET['city']
        if city:
            queryset_list = queryset_list.filter(city__iexact=city)

    # State
    if 'state' in request.GET:
        state = request.GET['state']
        if state:
            queryset_list = queryset_list.filter(state__iexact=state)

    # Bedrooms
    if 'bedrooms' in request.GET:
        bedrooms = request.GET['bedrooms']
        if bedrooms:
            queryset_list = queryset_list.filter(bedrooms__lte=bedrooms)

    # Price
    if 'price' in request.GET:
        price = request.GET['price']
        if price:
            queryset_list = queryset_list.filter(price__lte=price)

    context = {
        'state_choices': state_choices,
        'bedroom_choices': bedroom_choices,
        'price_choices': price_choices,
        'listings': queryset_list,
        'values': request.GET
    }

    return render(request, 'listings/search.html', context)
