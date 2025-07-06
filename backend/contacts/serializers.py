from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    """
    Serializer for Contact model
    """
    class Meta:
        model = Contact
        fields = [
            'id', 'listing', 'listing_id', 'name', 'email', 
            'phone', 'message', 'contact_date', 'user_id'
        ]
        read_only_fields = ('id', 'contact_date')

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
            'listing', 'listing_id', 'name', 'email', 
            'phone', 'message', 'user_id'
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
