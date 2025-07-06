from rest_framework import serializers
from .models import (
    Listing, PropertyCategory, PropertyFeature, 
    ListingAnalytics, PriceHistory, RealtorReview, PropertyModeration
)
from realtors.serializers import RealtorSerializer

class PropertyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyCategory
        fields = ['id', 'name', 'slug', 'description']

class PropertyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyFeature
        fields = ['id', 'name', 'category', 'icon']

class ListingAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingAnalytics
        fields = ['views', 'saves', 'inquiries', 'tours_scheduled', 'last_viewed']

class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ['price', 'event_type', 'notes', 'created_at']

class ListingSerializer(serializers.ModelSerializer):
    """
    Serializer for Listing model with all fields
    """
    realtor = RealtorSerializer(read_only=True)
    realtor_id = serializers.IntegerField(write_only=True)
    category = PropertyCategorySerializer(read_only=True)
    features = PropertyFeatureSerializer(many=True, read_only=True)
    analytics = ListingAnalyticsSerializer(read_only=True)
    price_history = PriceHistorySerializer(many=True, read_only=True)
    
    # Computed fields
    days_on_market = serializers.ReadOnlyField()
    price_per_sqft = serializers.ReadOnlyField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'realtor', 'realtor_id', 'title', 'address', 'city', 'state', 
            'zipcode', 'neighborhood', 'description', 'price', 'listing_type',
            'category', 'property_type', 'bedrooms', 'bathrooms', 'garage', 
            'parking_spaces', 'sqft', 'lot_size', 'year_built', 'floors', 
            'fireplaces', 'heating', 'cooling', 'hoa_fee', 'property_taxes',
            'features', 'photo_main', 'photo_1', 'photo_2', 'photo_3', 
            'photo_4', 'photo_5', 'photo_6', 'is_published', 'is_featured',
            'list_date', 'updated_at', 'analytics', 'price_history',
            'days_on_market', 'price_per_sqft'
        ]
        read_only_fields = ('id', 'list_date', 'updated_at', 'days_on_market', 'price_per_sqft')

    def validate_price(self, value):
        """Validate that price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_bedrooms(self, value):
        """Validate that bedrooms is positive"""
        if value <= 0:
            raise serializers.ValidationError("Bedrooms must be greater than 0")
        return value

    def validate_bathrooms(self, value):
        """Validate that bathrooms is positive"""
        if value <= 0:
            raise serializers.ValidationError("Bathrooms must be greater than 0")
        return value

    def validate_sqft(self, value):
        """Validate that sqft is positive"""
        if value <= 0:
            raise serializers.ValidationError("Square footage must be greater than 0")
        return value


class ListingListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing lists/search results
    """
    realtor_name = serializers.CharField(source='realtor.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    days_on_market = serializers.ReadOnlyField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'address', 'city', 'state', 'neighborhood', 'price', 
            'listing_type', 'property_type', 'bedrooms', 'bathrooms', 'sqft', 
            'photo_main', 'realtor_name', 'category_name', 'list_date', 'description',
            'is_featured', 'days_on_market'
        ]

class RealtorReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = RealtorReview
        fields = ['id', 'user', 'user_name', 'rating', 'title', 'review_text', 
                 'created_at', 'is_verified']
        read_only_fields = ['user', 'created_at']


class ListingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new listings
    """
    class Meta:
        model = Listing
        fields = [
            'realtor', 'title', 'address', 'city', 'state', 'zipcode', 
            'description', 'price', 'bedrooms', 'bathrooms', 'garage', 
            'sqft', 'lot_size', 'photo_main', 'photo_1', 'photo_2', 
            'photo_3', 'photo_4', 'photo_5', 'photo_6', 'is_published'
        ]

    def validate_price(self, value):
        """Validate that price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value


class ListingUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing listings
    """
    class Meta:
        model = Listing
        fields = [
            'title', 'address', 'city', 'state', 'zipcode', 'description', 
            'price', 'bedrooms', 'bathrooms', 'garage', 'sqft', 'lot_size', 
            'photo_main', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 
            'photo_5', 'photo_6', 'is_published'
        ]

    def validate_price(self, value):
        """Validate that price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

class ModerationListingSerializer(serializers.ModelSerializer):
    """
    Special serializer for listings in moderation that includes realtor details
    """
    realtor_name = serializers.CharField(source='realtor.name', read_only=True)
    realtor_email = serializers.CharField(source='realtor.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    days_on_market = serializers.ReadOnlyField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'address', 'city', 'state', 'neighborhood', 'price', 
            'listing_type', 'property_type', 'bedrooms', 'bathrooms', 'sqft', 
            'photo_main', 'realtor_name', 'realtor_email', 'category_name', 
            'list_date', 'description', 'is_featured', 'days_on_market', 'year_built'
        ]

class PropertyModerationSerializer(serializers.ModelSerializer):
    """
    Serializer for PropertyModeration model
    """
    listing = ModerationListingSerializer(read_only=True)
    listing_id = serializers.IntegerField(write_only=True)
    reviewed_by_name = serializers.SerializerMethodField()
    days_pending = serializers.ReadOnlyField()
    
    class Meta:
        model = PropertyModeration
        fields = [
            'id', 'listing', 'listing_id', 'status', 'priority', 
            'submitted_date', 'reviewed_date', 'reviewed_by', 'reviewed_by_name',
            'reason', 'notes', 'report_count', 'days_pending',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['submitted_date', 'created_at', 'updated_at', 'days_pending']
    
    def get_reviewed_by_name(self, obj):
        """Get the name of the user who reviewed the property"""
        if obj.reviewed_by:
            return f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}".strip()
        return None

class PropertyModerationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating PropertyModeration status
    """
    class Meta:
        model = PropertyModeration
        fields = ['status', 'priority', 'reason', 'notes', 'reviewed_by']
        
    def update(self, instance, validated_data):
        # Set reviewed_date when status is changed
        if 'status' in validated_data:
            from django.utils import timezone
            instance.reviewed_date = timezone.now()
        
        return super().update(instance, validated_data)
    """
    Special serializer for listings in moderation that includes realtor details
    """
    realtor_name = serializers.CharField(source='realtor.name', read_only=True)
    realtor_email = serializers.CharField(source='realtor.email', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    days_on_market = serializers.ReadOnlyField()
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'address', 'city', 'state', 'neighborhood', 'price', 
            'listing_type', 'property_type', 'bedrooms', 'bathrooms', 'sqft', 
            'photo_main', 'realtor_name', 'realtor_email', 'category_name', 
            'list_date', 'description', 'is_featured', 'days_on_market', 'year_built'
        ]
