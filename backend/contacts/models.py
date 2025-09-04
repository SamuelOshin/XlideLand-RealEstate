from django.db import models
from datetime import datetime

class Contact(models.Model):
  # Contact type choices
  CONTACT_TYPE_CHOICES = [
    ('general', 'General Inquiry'),
    ('property', 'Property Inquiry'),
    ('viewing', 'Property Viewing'),
    ('consultation', 'Consultation Request'),
    ('support', 'Support'),
  ]
  
  # Status choices
  STATUS_CHOICES = [
    ('new', 'New'),
    ('in_progress', 'In Progress'),
    ('contacted', 'Contacted'),
    ('resolved', 'Resolved'),
    ('closed', 'Closed'),
  ]
  
  # Property type choices
  PROPERTY_TYPE_CHOICES = [
    ('house', 'House'),
    ('apartment', 'Apartment'),
    ('condo', 'Condo'),
    ('townhouse', 'Townhouse'),
    ('villa', 'Villa'),
    ('land', 'Land'),
    ('commercial', 'Commercial'),
    ('other', 'Other'),
  ]
  
  # Budget range choices
  BUDGET_RANGE_CHOICES = [
    ('under_50m', 'Under ₦50M'),
    ('50m_100m', '₦50M - ₦100M'),
    ('100m_200m', '₦100M - ₦200M'),
    ('200m_500m', '₦200M - ₦500M'),
    ('500m_1b', '₦500M - ₦1B'),
    ('over_1b', 'Over ₦1B'),
    ('not_specified', 'Not Specified'),
  ]
  
  # Timeline choices
  TIMELINE_CHOICES = [
    ('immediate', 'Immediately'),
    ('1_month', 'Within 1 Month'),
    ('3_months', 'Within 3 Months'),
    ('6_months', 'Within 6 Months'),
    ('1_year', 'Within 1 Year'),
    ('flexible', 'Flexible'),
  ]
  
  # Original fields
  listing = models.CharField(max_length=200, blank=True)
  listing_id = models.IntegerField(blank=True, null=True)
  name = models.CharField(max_length=200)
  email = models.CharField(max_length=100)
  phone = models.CharField(max_length=100)
  message = models.TextField(blank=True)
  contact_date = models.DateTimeField(default=datetime.now, blank=True)
  user_id = models.IntegerField(blank=True, null=True)
  
  # New enhanced fields
  property_type = models.CharField(max_length=20, choices=PROPERTY_TYPE_CHOICES, blank=True)
  budget_range = models.CharField(max_length=20, choices=BUDGET_RANGE_CHOICES, blank=True)
  timeline = models.CharField(max_length=20, choices=TIMELINE_CHOICES, blank=True)
  contact_type = models.CharField(max_length=20, choices=CONTACT_TYPE_CHOICES, default='general')
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
  subject = models.CharField(max_length=255, blank=True)
  
  # Additional fields for better tracking
  responded_at = models.DateTimeField(blank=True, null=True)
  resolved_at = models.DateTimeField(blank=True, null=True)
  notes = models.TextField(blank=True, help_text="Internal notes for staff")
  
  class Meta:
    ordering = ['-contact_date']
    verbose_name = "Contact Inquiry"
    verbose_name_plural = "Contact Inquiries"
  
  def __str__(self):
    return f"{self.name} - {self.get_contact_type_display()}" if self.contact_type else self.name