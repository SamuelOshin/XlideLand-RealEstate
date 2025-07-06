from django.contrib import admin
from .models import (
    Listing, PropertyCategory, PropertyFeature, 
    ListingAnalytics, ListingView, PriceHistory, RealtorReview
)

class ListingAnalyticsInline(admin.StackedInline):
    model = ListingAnalytics
    extra = 0

class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 0
    readonly_fields = ('created_at',)

class ListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'property_type', 'listing_type', 'is_published', 
                   'is_featured', 'price', 'days_on_market', 'list_date', 'realtor')
    list_display_links = ('id', 'title')
    list_filter = ('property_type', 'listing_type', 'is_published', 'is_featured', 
                  'realtor', 'category', 'city', 'state')
    list_editable = ('is_published', 'is_featured')
    search_fields = ('title', 'description', 'address', 'city', 'state', 'zipcode')
    list_per_page = 25
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'realtor', 'category')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'zipcode', 'neighborhood')
        }),
        ('Property Details', {
            'fields': ('property_type', 'listing_type', 'price', 'bedrooms', 'bathrooms', 
                      'sqft', 'lot_size', 'year_built', 'floors', 'fireplaces')
        }),
        ('Features & Amenities', {
            'fields': ('features', 'garage', 'parking_spaces', 'heating', 'cooling')
        }),
        ('Financial', {
            'fields': ('hoa_fee', 'property_taxes')
        }),
        ('Images', {
            'fields': ('photo_main', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5', 'photo_6')
        }),
        ('Status', {
            'fields': ('is_published', 'is_featured', 'list_date')
        }),
    )
    
    filter_horizontal = ('features',)
    inlines = [ListingAnalyticsInline, PriceHistoryInline]

class PropertyCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class PropertyFeatureAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'icon')
    list_filter = ('category',)
    search_fields = ('name',)

class ListingAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('listing', 'views', 'saves', 'inquiries', 'tours_scheduled', 'last_viewed')
    list_filter = ('last_viewed',)
    readonly_fields = ('listing',)

class RealtorReviewAdmin(admin.ModelAdmin):
    list_display = ('realtor', 'user', 'rating', 'title', 'created_at', 'is_verified')
    list_filter = ('rating', 'is_verified', 'created_at')
    search_fields = ('realtor__name', 'user__username', 'title', 'review_text')
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Listing, ListingAdmin)
admin.site.register(PropertyCategory, PropertyCategoryAdmin)
admin.site.register(PropertyFeature, PropertyFeatureAdmin)
admin.site.register(ListingAnalytics, ListingAnalyticsAdmin)
admin.site.register(RealtorReview, RealtorReviewAdmin)
