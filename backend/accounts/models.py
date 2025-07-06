from django.db import models
from django.contrib.auth.models import User
from listings.models import Listing
from realtors.models import Realtor
from datetime import datetime
import uuid


class UserProfile(models.Model):
    """Extended user profile with additional dashboard data"""
    ROLE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller/Agent'),
        ('admin', 'Administrator'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    joined_date = models.DateTimeField(auto_now_add=True)
    last_login_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"


class UserFavorite(models.Model):
    """User's favorite/saved properties"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('user', 'listing')
    
    def __str__(self):
        return f"{self.user.username} - {self.listing.title}"


class Tour(models.Model):
    """Property tour appointments"""
    TOUR_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    TOUR_TYPE_CHOICES = [
        ('in-person', 'In-Person'),
        ('virtual', 'Virtual'),
        ('self-guided', 'Self-Guided'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tours')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='tours')
    realtor = models.ForeignKey(Realtor, on_delete=models.CASCADE, related_name='tours')
    date = models.DateTimeField()
    duration = models.IntegerField(default=60)  # Duration in minutes
    tour_type = models.CharField(max_length=15, choices=TOUR_TYPE_CHOICES, default='in-person')
    status = models.CharField(max_length=15, choices=TOUR_STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    confirmation_code = models.CharField(max_length=50, unique=True)
    reminder_sent = models.BooleanField(default=False)
    feedback_rating = models.IntegerField(null=True, blank=True)  # 1-5 rating
    feedback_comment = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.confirmation_code:
            self.confirmation_code = f"XL{datetime.now().year}-{str(uuid.uuid4())[:6].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.username} - {self.listing.title} ({self.date})"


class Conversation(models.Model):
    """Message conversations between users"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(User, related_name='conversations')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True, related_name='conversations')
    subject = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Conversation: {self.subject}"


class Message(models.Model):
    """Individual messages within conversations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} in {self.conversation.subject}"


class PropertyAlert(models.Model):
    """User's property search alerts"""
    ALERT_FREQUENCY_CHOICES = [
        ('instant', 'Instant'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    ALERT_TYPE_CHOICES = [
        ('new_listings', 'New Listings'),
        ('price_drop', 'Price Drop'),
        ('status_change', 'Status Change'),
        ('market_update', 'Market Update'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')
    name = models.CharField(max_length=100)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    criteria = models.JSONField()  # Search criteria as JSON
    frequency = models.CharField(max_length=10, choices=ALERT_FREQUENCY_CHOICES, default='daily')
    is_active = models.BooleanField(default=True)
    last_triggered = models.DateTimeField(null=True, blank=True)
    match_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class Document(models.Model):
    """User documents related to properties"""
    DOCUMENT_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('inspection', 'Inspection Report'),
        ('appraisal', 'Appraisal'),
        ('mortgage', 'Mortgage Documents'),
        ('insurance', 'Insurance'),
        ('deed', 'Deed'),
        ('disclosure', 'Disclosure'),
        ('other', 'Other'),
    ]
    
    DOCUMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('signed', 'Signed'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    name = models.CharField(max_length=255)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    file_size = models.BigIntegerField(null=True, blank=True)  # Size in bytes
    status = models.CharField(max_length=15, choices=DOCUMENT_STATUS_CHOICES, default='pending')
    is_private = models.BooleanField(default=True)
    shared_with = models.ManyToManyField(User, blank=True, related_name='shared_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class Notification(models.Model):
    """User notifications"""
    NOTIFICATION_TYPE_CHOICES = [
        ('tour_confirmed', 'Tour Confirmed'),
        ('tour_reminder', 'Tour Reminder'),
        ('message_received', 'Message Received'),
        ('property_alert', 'Property Alert'),
        ('price_drop', 'Price Drop'),
        ('new_listing', 'New Listing'),
        ('status_update', 'Status Update'),
        ('document_shared', 'Document Shared'),
        ('system', 'System Notification'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    is_important = models.BooleanField(default=False)
    action_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.title}"


class UserActivity(models.Model):
    """Track user activities for dashboard"""
    ACTIVITY_TYPE_CHOICES = [
        ('property_viewed', 'Property Viewed'),
        ('property_saved', 'Property Saved'),
        ('property_removed', 'Property Removed'),
        ('tour_scheduled', 'Tour Scheduled'),
        ('tour_completed', 'Tour Completed'),
        ('message_sent', 'Message Sent'),
        ('alert_created', 'Alert Created'),
        ('document_uploaded', 'Document Uploaded'),
        ('profile_updated', 'Profile Updated'),
        ('search_performed', 'Search Performed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    description = models.CharField(max_length=255)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)  # Additional activity data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} ({self.created_at})"
