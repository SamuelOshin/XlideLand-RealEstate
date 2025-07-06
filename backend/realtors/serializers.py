from rest_framework import serializers
from .models import Realtor
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ('id', 'username')


class RealtorSerializer(serializers.ModelSerializer):
    """
    Serializer for Realtor model
    """
    user = UserSerializer(read_only=True)
    experience_display = serializers.SerializerMethodField()
    total_sales_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Realtor
        fields = [
            'id', 'user', 'name', 'title', 'photo', 'description', 'bio', 
            'phone', 'email', 'license_number', 'years_experience', 
            'total_sales_count', 'total_sales_volume', 'website', 
            'linkedin_url', 'facebook_url', 'instagram_url', 'average_rating',
            'total_reviews', 'languages', 'specializations', 'is_mvp', 
            'is_active', 'hire_date', 'experience_display', 'total_sales_display'
        ]
        read_only_fields = ('id', 'hire_date', 'average_rating', 'total_reviews', 
                           'experience_display', 'total_sales_display')
    
    def get_experience_display(self, obj):
        """Return formatted experience string"""
        if obj.years_experience > 0:
            return f"{obj.years_experience}+ Years"
        return "New Agent"
    
    def get_total_sales_display(self, obj):
        """Return formatted total sales string"""
        if obj.total_sales_volume > 1000000:
            return f"${obj.total_sales_volume/1000000:.1f}M+"
        elif obj.total_sales_volume > 0:
            return f"${obj.total_sales_volume:,.0f}"
        return "New Agent"

    def validate_email(self, value):
        """Validate email format"""
        if not value:
            raise serializers.ValidationError("Email is required")
        return value

    def validate_phone(self, value):
        """Validate phone format"""
        if not value:
            raise serializers.ValidationError("Phone number is required")
        return value


class RealtorListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for realtor lists
    """
    class Meta:
        model = Realtor
        fields = ['id', 'name', 'photo', 'phone', 'email', 'is_mvp']


class RealtorCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new realtors
    """
    class Meta:
        model = Realtor
        fields = [
            'name', 'photo', 'description', 'phone', 'email', 'is_mvp'
        ]

    def validate_email(self, value):
        """Validate that email is unique"""
        if Realtor.objects.filter(email=value).exists():
            raise serializers.ValidationError("A realtor with this email already exists")
        return value
