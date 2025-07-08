from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from listings.models import Listing
from realtors.models import Realtor
from .models import (
    UserProfile, UserFavorite, Tour, Conversation, Message, 
    PropertyAlert, Document, Notification, UserActivity, FileUpload, FileUploadSession
)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with role selection
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=[('buyer', 'Buyer'), ('seller', 'Seller/Agent')],
        default='buyer',
        help_text="Select your account type. Admin accounts can only be created by existing admins."
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        # Ensure non-admin users cannot create admin accounts
        role = attrs.get('role', 'buyer')
        if role == 'admin':
            request = self.context.get('request')
            if not request or not request.user.is_authenticated or not request.user.is_staff:
                raise serializers.ValidationError("Only administrators can create admin accounts.")
        
        return attrs
    
    def create(self, validated_data):
        role = validated_data.pop('role', 'buyer')
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(**validated_data)
        
        # Create user profile with selected role
        UserProfile.objects.create(user=user, role=role)
        
        # Create realtor record for sellers
        if role == 'seller':
            from realtors.models import Realtor
            Realtor.objects.create(
                user=user,
                name=f"{user.first_name} {user.last_name}".strip() or user.username,
                title="Real Estate Agent",
                email=user.email,
                phone="", # Will be filled later in profile
                is_active=True
            )
        
        return user


class AdminUserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for admin-only user registration (can create admin accounts)
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=[('buyer', 'Buyer'), ('seller', 'Seller/Agent'), ('admin', 'Administrator')],
        default='buyer',
        help_text="Select the account type for the new user."
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        role = validated_data.pop('role', 'buyer')
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(**validated_data)
        
        # Set staff status for admin users
        if role == 'admin':
            user.is_staff = True
            user.save()
        
        # Create user profile with selected role
        UserProfile.objects.create(user=user, role=role)
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer with email login support
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Accept email field for login
        self.fields['email'] = serializers.EmailField(required=False)
        # Make username optional since we can use email
        self.fields['username'].required = False
    
    def validate(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username')
        password = attrs.get('password')
        
        # Determine login credential
        login_credential = email or username
        
        if not login_credential:
            raise serializers.ValidationError('Must provide either email or username')
        
        # If email is provided, find the username
        if email:
            try:
                user = User.objects.get(email=email)
                attrs['username'] = user.username
            except User.DoesNotExist:
                raise serializers.ValidationError('No user found with this email address')
        
        # Remove email from attrs before parent validation
        if 'email' in attrs:
            attrs.pop('email')
        
        return super().validate(attrs)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        return token


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not authenticate(username=user.username, password=value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


# ============================================================================
# DASHBOARD SERIALIZERS - FOR FRONTEND INTEGRATION
# ============================================================================

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile with dashboard data"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'role', 'avatar', 'phone', 'bio', 'is_verified', 'joined_date', 'last_login_date']
        read_only_fields = ['user', 'joined_date']


class ListingSerializer(serializers.ModelSerializer):
    """Basic listing serializer for dashboard use"""
    realtor_name = serializers.CharField(source='realtor.name', read_only=True)
    realtor_email = serializers.CharField(source='realtor.email', read_only=True)
    realtor_phone = serializers.CharField(source='realtor.phone', read_only=True)
    
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'address', 'city', 'state', 'zipcode', 'description',
            'price', 'bedrooms', 'bathrooms', 'garage', 'sqft', 'lot_size',
            'photo_main', 'photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5', 'photo_6',
            'is_published', 'list_date', 'realtor_name', 'realtor_email', 'realtor_phone'
        ]


class UserFavoriteSerializer(serializers.ModelSerializer):
    """Serializer for user favorites"""
    listing = ListingSerializer(read_only=True)
    listing_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = UserFavorite
        fields = ['id', 'listing', 'listing_id', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TourSerializer(serializers.ModelSerializer):
    """Serializer for property tours"""
    listing = ListingSerializer(read_only=True)
    listing_id = serializers.IntegerField(write_only=True)
    realtor_name = serializers.CharField(source='realtor.name', read_only=True)
    realtor_phone = serializers.CharField(source='realtor.phone', read_only=True)
    realtor_email = serializers.CharField(source='realtor.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Tour
        fields = [
            'id', 'listing', 'listing_id', 'date', 'duration', 'tour_type', 'status',
            'notes', 'confirmation_code', 'reminder_sent', 'feedback_rating',
            'feedback_comment', 'cancellation_reason', 'created_at', 'updated_at',
            'realtor_name', 'realtor_phone', 'realtor_email', 'user_name'
        ]
        read_only_fields = ['id', 'confirmation_code', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Auto-assign realtor from listing
        listing = Listing.objects.get(id=validated_data['listing_id'])
        validated_data['realtor'] = listing.realtor
        return super().create(validated_data)


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for messages"""
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'sender_name', 'sender_username',
            'content', 'is_read', 'read_at', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    """Serializer for conversations"""
    participants = UserSerializer(many=True, read_only=True)
    listing = ListingSerializer(read_only=True)
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'participants', 'listing', 'subject', 'created_at', 'updated_at',
            'is_archived', 'latest_message', 'unread_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_latest_message(self, obj):
        latest = obj.messages.first()
        return MessageSerializer(latest).data if latest else None
    
    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()


class PropertyAlertSerializer(serializers.ModelSerializer):
    """Serializer for property alerts"""
    
    class Meta:
        model = PropertyAlert
        fields = [
            'id', 'name', 'alert_type', 'criteria', 'frequency', 'is_active',
            'last_triggered', 'match_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_triggered', 'match_count', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for documents"""
    listing = ListingSerializer(read_only=True)
    listing_id = serializers.IntegerField(write_only=True, required=False)
    shared_with = UserSerializer(many=True, read_only=True)
    file_url = serializers.CharField(source='file.url', read_only=True)
    
    class Meta:
        model = Document
        fields = [
            'id', 'listing', 'listing_id', 'name', 'document_type', 'file', 'file_url',
            'file_size', 'status', 'is_private', 'shared_with', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_size', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Calculate file size
        if 'file' in validated_data:
            validated_data['file_size'] = validated_data['file'].size
        return super().create(validated_data)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications"""
    listing = ListingSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'type', 'title', 'message', 'listing', 'is_read', 'is_important',
            'action_url', 'created_at', 'read_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for user activities"""
    listing = ListingSerializer(read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'activity_type', 'description', 'listing', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    saved_properties = serializers.IntegerField()
    scheduled_tours = serializers.IntegerField()
    active_alerts = serializers.IntegerField()
    unread_messages = serializers.IntegerField()
    total_properties = serializers.IntegerField()
    recent_activity_count = serializers.IntegerField()


class DashboardDataSerializer(serializers.Serializer):
    """Main dashboard data serializer"""
    user = UserProfileSerializer()
    stats = DashboardStatsSerializer()
    recent_activities = UserActivitySerializer(many=True)
    recommended_properties = ListingSerializer(many=True)
    upcoming_tours = TourSerializer(many=True)
    unread_notifications = NotificationSerializer(many=True)


class AdminUserManagementSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer for admin user management with profile information
    """
    role = serializers.CharField(source='profile.role', read_only=True, default='buyer')
    phone = serializers.CharField(source='profile.phone', read_only=True, default='')
    is_verified = serializers.BooleanField(source='profile.is_verified', read_only=True, default=False)
    joined_date = serializers.DateTimeField(source='profile.joined_date', read_only=True)
    last_login_date = serializers.DateTimeField(source='profile.last_login_date', read_only=True)
    properties_count = serializers.SerializerMethodField()
    inquiries_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'is_active', 'is_staff', 'date_joined', 'last_login',
            'role', 'phone', 'is_verified', 'joined_date', 'last_login_date',
            'properties_count', 'inquiries_count'
        ]
        read_only_fields = ['id', 'username', 'date_joined']
    
    def get_properties_count(self, obj):
        """Get count of properties for this user (if they're a realtor)"""
        try:
            from listings.models import Listing
            return Listing.objects.filter(realtor__email=obj.email).count()
        except:
            return 0
    
    def get_inquiries_count(self, obj):
        """Get count of inquiries for this user"""
        try:
            from contacts.models import Contact
            return Contact.objects.filter(user_id=obj.id).count()
        except:
            return 0


class FileUploadSerializer(serializers.ModelSerializer):
    """
    Serializer for file upload metadata
    """
    file_size_mb = serializers.ReadOnlyField()
    is_image = serializers.ReadOnlyField()
    
    class Meta:
        model = FileUpload
        fields = [
            'id', 'file_name', 'original_name', 'file_type', 'mime_type', 
            'file_size', 'file_size_mb', 'blob_url', 'blob_key', 
            'upload_status', 'category', 'tags', 'listing', 'property_id',
            'uploaded_at', 'updated_at', 'is_image'
        ]
        read_only_fields = ['id', 'uploaded_at', 'updated_at', 'file_size_mb', 'is_image']


class FileUploadSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for file upload sessions
    """
    
    class Meta:
        model = FileUploadSession
        fields = [
            'id', 'session_name', 'upload_type', 'total_files', 
            'uploaded_files', 'failed_files', 'session_status',
            'property_id', 'listing', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']
