from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from realtors.models import Realtor

class PropertyCategory(models.Model):
    """Property categories like luxury, residential, commercial, etc."""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Property Categories"
    
    def __str__(self):
        return self.name

class PropertyFeature(models.Model):
    """Individual property features like 'Swimming Pool', 'Smart Home', etc."""
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, default='general')  # interior, exterior, amenity, etc.
    icon = models.CharField(max_length=50, blank=True)  # Icon name for frontend
    
    def __str__(self):
        return self.name

class Listing(models.Model):
    LISTING_TYPE_CHOICES = [
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    ]
    
    PROPERTY_TYPE_CHOICES = [
        ('house', 'House'),
        ('condo', 'Condominium'),
        ('townhouse', 'Townhouse'),
        ('apartment', 'Apartment'),
        ('loft', 'Loft'),
        ('villa', 'Villa'),
        ('penthouse', 'Penthouse'),
        ('commercial', 'Commercial'),
    ]
    
    HEATING_CHOICES = [
        ('central', 'Central'),
        ('gas', 'Gas'),
        ('electric', 'Electric'),
        ('oil', 'Oil'),
        ('solar', 'Solar'),
        ('none', 'None'),
    ]
    
    COOLING_CHOICES = [
        ('central', 'Central Air'),
        ('window', 'Window Units'),
        ('none', 'None'),
    ]
    
    # Basic Information
    realtor = models.ForeignKey(Realtor, on_delete=models.DO_NOTHING)
    title = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=20)
    neighborhood = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    
    # Pricing and Type
    price = models.IntegerField()
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPE_CHOICES, default='sale')
    category = models.ForeignKey(PropertyCategory, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Property Details
    property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES, default='house')
    bedrooms = models.IntegerField()
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1)
    garage = models.IntegerField(default=0)
    parking_spaces = models.IntegerField(default=0)
    sqft = models.IntegerField()
    lot_size = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Additional Property Details
    year_built = models.IntegerField(null=True, blank=True)
    floors = models.IntegerField(default=1)
    fireplaces = models.IntegerField(default=0)
    heating = models.CharField(max_length=20, choices=HEATING_CHOICES, default='central')
    cooling = models.CharField(max_length=20, choices=COOLING_CHOICES, default='central')
    
    # Financial Information
    hoa_fee = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    property_taxes = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Features and Amenities
    features = models.ManyToManyField(PropertyFeature, blank=True)
    
    # Images
    photo_main = models.ImageField(upload_to='photos/%Y/%m/%d/')
    photo_1 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_2 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_3 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_4 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_5 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    photo_6 = models.ImageField(upload_to='photos/%Y/%m/%d/', blank=True)
    
    # Status and Metadata
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    list_date = models.DateTimeField(default=datetime.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-list_date']
    
    def __str__(self):
        return self.title
    
    @property
    def days_on_market(self):
        """Calculate days on market"""
        from django.utils import timezone
        return (timezone.now().date() - self.list_date.date()).days
    
    @property
    def price_per_sqft(self):
        """Calculate price per square foot"""
        if self.sqft > 0:
            return round(self.price / self.sqft, 2)
        return 0

class ListingAnalytics(models.Model):
    """Track listing analytics like views, saves, inquiries"""
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='analytics')
    views = models.IntegerField(default=0)
    saves = models.IntegerField(default=0)
    inquiries = models.IntegerField(default=0)
    tours_scheduled = models.IntegerField(default=0)
    last_viewed = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Analytics for {self.listing.title}"

class ListingView(models.Model):
    """Track individual listing views"""
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='view_records')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['listing', 'user', 'ip_address']

class PriceHistory(models.Model):
    """Track price changes for listings"""
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='price_history')
    price = models.IntegerField()
    event_type = models.CharField(max_length=20, choices=[
        ('listed', 'Listed'),
        ('price_increase', 'Price Increase'),
        ('price_decrease', 'Price Decrease'),
        ('sold', 'Sold'),
        ('withdrawn', 'Withdrawn'),
    ])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.listing.title} - {self.event_type} - ${self.price:,}"

class RealtorReview(models.Model):
    """Reviews and ratings for realtors"""
    realtor = models.ForeignKey('realtors.Realtor', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    title = models.CharField(max_length=200)
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['realtor', 'user', 'listing']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.realtor.name} - {self.rating} stars"

class PropertyModeration(models.Model):
    """Model for tracking property moderation and admin reviews"""
    MODERATION_STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('flagged', 'Flagged'),
        ('under_review', 'Under Review'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    listing = models.OneToOneField(Listing, on_delete=models.CASCADE, related_name='moderation')
    status = models.CharField(max_length=20, choices=MODERATION_STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    submitted_date = models.DateTimeField(auto_now_add=True)
    reviewed_date = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='moderated_properties')
    reason = models.TextField(blank=True, help_text='Reason for rejection or flagging')
    notes = models.TextField(blank=True, help_text='Internal admin notes')
    report_count = models.IntegerField(default=0, help_text='Number of user reports')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', '-submitted_date']
        verbose_name = 'Property Moderation'
        verbose_name_plural = 'Property Moderations'
    
    def __str__(self):
        return f"{self.listing.title} - {self.status}"
    
    @property
    def days_pending(self):
        """Calculate days since submission"""
        from django.utils import timezone
        return (timezone.now().date() - self.submitted_date.date()).days

# Add this at the end of the file to update realtor ratings when reviews are saved
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

@receiver([post_save, post_delete], sender=RealtorReview)
def update_realtor_rating(sender, instance, **kwargs):
    """Update realtor's average rating when reviews change"""
    realtor = instance.realtor
    reviews = RealtorReview.objects.filter(realtor=realtor)
    
    if reviews.exists():
        from django.db.models import Avg
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        realtor.average_rating = round(avg_rating, 2)
        realtor.total_reviews = reviews.count()
    else:
        realtor.average_rating = 0.0
        realtor.total_reviews = 0
    
    realtor.save()