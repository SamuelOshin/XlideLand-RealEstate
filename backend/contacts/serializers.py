from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    """
    Serializer for Contact model
    """
    contact_type_display = serializers.CharField(source='get_contact_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    property_type_display = serializers.CharField(source='get_property_type_display', read_only=True)
    budget_range_display = serializers.CharField(source='get_budget_range_display', read_only=True)
    timeline_display = serializers.CharField(source='get_timeline_display', read_only=True)
    
    class Meta:
        model = Contact
        fields = [
            'id', 'listing', 'listing_id', 'name', 'email', 'phone', 'message', 
            'contact_date', 'user_id', 'property_type', 'budget_range', 'timeline',
            'contact_type', 'status', 'subject', 'responded_at', 'resolved_at', 'notes',
            'contact_type_display', 'status_display', 'property_type_display',
            'budget_range_display', 'timeline_display'
        ]
        read_only_fields = ('id', 'contact_date', 'responded_at', 'resolved_at', 'notes')

    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required")
        return value

    def validate_name(self, value):
        """Validate name is provided"""
        if not value:
            raise serializers.ValidationError("Name is required")
        return value


class ContactCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new contacts
    """
    class Meta:
        model = Contact
        fields = [
            'listing', 'listing_id', 'name', 'email', 'phone', 'message', 
            'user_id', 'property_type', 'budget_range', 'timeline',
            'contact_type', 'subject'
        ]

    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required")
        return value

    def validate_name(self, value):
        """Validate name is provided"""
        if not value:
            raise serializers.ValidationError("Name is required")
        return value


class ContactUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating contact status (admin use)
    """
    class Meta:
        model = Contact
        fields = ['status', 'notes', 'responded_at', 'resolved_at']
        
    def update(self, instance, validated_data):
        """Update contact with timestamp tracking"""
        from django.utils import timezone
        
        # Set responded_at when status changes to contacted
        if validated_data.get('status') == 'contacted' and instance.status != 'contacted':
            validated_data['responded_at'] = timezone.now()
            
        # Set resolved_at when status changes to resolved or closed
        if validated_data.get('status') in ['resolved', 'closed'] and instance.status not in ['resolved', 'closed']:
            validated_data['resolved_at'] = timezone.now()
            
        return super().update(instance, validated_data)
