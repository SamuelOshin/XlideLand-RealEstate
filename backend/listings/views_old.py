from rest_framework import generics, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Listing
from .serializers import (
    ListingSerializer, 
    ListingListSerializer, 
    ListingCreateSerializer, 
    ListingUpdateSerializer
)


class ListingListAPIView(generics.ListAPIView):
    """
    List all published listings with search and filter capabilities
    """
    queryset = Listing.objects.filter(is_published=True).order_by('-list_date')
    serializer_class = ListingListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'state', 'bedrooms', 'bathrooms', 'realtor']
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
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if min_sqft:
            queryset = queryset.filter(sqft__gte=min_sqft)
        if max_sqft:
            queryset = queryset.filter(sqft__lte=max_sqft)
            
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


@api_view(['GET'])
def featured_listings(request):
    """
    Get featured listings (MVP realtors or latest listings)
    """
    try:
        # Get listings from MVP realtors or latest 6 listings
        featured = Listing.objects.filter(
            is_published=True,
            realtor__is_mvp=True
        ).order_by('-list_date')[:6]
        
        if featured.count() < 6:
            # If not enough MVP listings, get latest listings
            featured = Listing.objects.filter(
                is_published=True
            ).order_by('-list_date')[:6]
        
        serializer = ListingListSerializer(featured, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch featured listings'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def search_listings(request):
    """
    Advanced search for listings
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
        return Response(serializer.data)
    
    except Exception as e:
        return Response(
            {'error': 'Search failed'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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
