from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import timedelta
import logging

from .models import (
    UserProfile, UserFavorite, Tour, Conversation, Message, 
    PropertyAlert, Document, Notification, UserActivity,
    FileUpload, FileUploadSession
)
from .serializers import (
    UserRegistrationSerializer,    UserSerializer, 
    UserUpdateSerializer,
    CustomTokenObtainPairSerializer,
    PasswordChangeSerializer,
    UserProfileSerializer,
    UserFavoriteSerializer,
    TourSerializer,
    ConversationSerializer,
    MessageSerializer,
    PropertyAlertSerializer,
    DocumentSerializer,
    NotificationSerializer,
    UserActivitySerializer,
    DashboardStatsSerializer,
    AdminUserRegistrationSerializer,
    AdminUserManagementSerializer,
    FileUploadSerializer
)
from listings.models import Listing
from listings.serializers import ListingSerializer

logger = logging.getLogger(__name__)


# ================== AUTHENTICATION VIEWS ==================

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view with additional user data
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserRegistrationAPIView(generics.CreateAPIView):
    """
    Register a new user (public access allowed)
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = []  # Allow public access for registration
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            {
                'user': UserSerializer(user).data,
                'message': 'User registered successfully'
            },
            status=status.HTTP_201_CREATED
        )


class UserProfileAPIView(generics.RetrieveAPIView):
    """
    Get current user profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserUpdateAPIView(generics.UpdateAPIView):
    """
    Update current user profile
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change user password
    """
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        return Response({'message': 'Password changed successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ================== USER PROFILE MANAGEMENT ==================

class UserProfileViewSet(ModelViewSet):
    """
    ViewSet for managing user profiles
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            profile, created = UserProfile.objects.get_or_create(user=self.request.user)
            return profile
        return super().get_object()


# ================== DASHBOARD & ANALYTICS ==================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Get comprehensive dashboard statistics
    """
    user = request.user
    
    # User's listings
    user_listings = Listing.objects.filter(realtor=user) if hasattr(user, 'realtor_profile') else Listing.objects.none()
    
    # User activities
    recent_activities = UserActivity.objects.filter(user=user).order_by('-created_at')[:10]
    
    # Tour statistics
    tours = Tour.objects.filter(user=user)
    pending_tours = tours.filter(status='pending').count()
    confirmed_tours = tours.filter(status='confirmed').count()
    
    # Favorites
    favorites_count = UserFavorite.objects.filter(user=user).count()
    
    # Notifications
    unread_notifications = Notification.objects.filter(user=user, is_read=False).count()
    
    # Messages
    unread_messages = Message.objects.filter(
        conversation__participants=user,
        is_read=False
    ).exclude(sender=user).count()
    
    # Property alerts
    active_alerts = PropertyAlert.objects.filter(user=user, is_active=True).count()
    
    stats = {
        'user_info': UserSerializer(user).data,
        'properties': {
            'total_listings': user_listings.count(),
            'active_listings': user_listings.filter(is_published=True).count(),
            'favorites_count': favorites_count,
        },
        'tours': {
            'total_tours': tours.count(),
            'pending_tours': pending_tours,
            'confirmed_tours': confirmed_tours,
            'completed_tours': tours.filter(status='completed').count(),
        },
        'communications': {
            'unread_messages': unread_messages,
            'unread_notifications': unread_notifications,
            'active_conversations': Conversation.objects.filter(participants=user).count(),
        },
        'alerts': {
            'active_alerts': active_alerts,
        },
        'recent_activities': UserActivitySerializer(recent_activities, many=True).data,
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_analytics(request):
    """
    Get detailed user analytics and insights
    """
    user = request.user
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
      # Activity trends
    activities = UserActivity.objects.filter(
        user=user,
        created_at__gte=start_date
    ).values('activity_type').annotate(count=Count('id'))
    
    # Tour analytics
    tour_stats = Tour.objects.filter(
        user=user,
        created_at__gte=start_date
    ).values('status').annotate(count=Count('id'))
      # Property interaction stats
    viewed_properties = UserActivity.objects.filter(
        user=user,
        activity_type='property_view',
        created_at__gte=start_date
    ).count()
    
    analytics = {
        'period_days': days,
        'activity_summary': list(activities),
        'tour_statistics': list(tour_stats),        'property_interactions': {
            'views': viewed_properties,
            'favorites_added': UserActivity.objects.filter(
                user=user,
                activity_type='favorite_added',
                created_at__gte=start_date
            ).count(),
        },
        'engagement_score': min(100, (viewed_properties) * 2),
    }
    
    return Response(analytics)


# ================== FAVORITES MANAGEMENT ==================

class UserFavoriteViewSet(ModelViewSet):
    """
    ViewSet for managing user favorites
    """
    serializer_class = UserFavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserFavorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        favorite = serializer.save(user=self.request.user)
        
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            activity_type='favorite_added',
            description=f'Added property "{favorite.property.title}" to favorites'
        )

    def perform_destroy(self, instance):
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            activity_type='favorite_removed',
            description=f'Removed property "{instance.property.title}" from favorites'
        )
        instance.delete()


# ================== TOUR MANAGEMENT ==================

class TourViewSet(ModelViewSet):
    """
    ViewSet for managing property tours
    """
    serializer_class = TourSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['property__title', 'notes']
    ordering_fields = ['scheduled_date', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Tour.objects.filter(user=self.request.user)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset

    def perform_create(self, serializer):
        tour = serializer.save(user=self.request.user)
        
        # Create notification for property owner/realtor
        if hasattr(tour.property, 'realtor'):
            Notification.objects.create(
                user=tour.property.realtor,
                type='tour_request',
                title='New Tour Request',
                message=f'{tour.user.get_full_name()} requested a tour for {tour.property.title}',
                related_object_id=tour.id
            )
        
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            activity_type='tour_scheduled',
            description=f'Scheduled tour for "{tour.property.title}"'
        )

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a tour"""
        tour = self.get_object()
        if tour.status in ['pending', 'confirmed']:
            tour.status = 'cancelled'
            tour.save()
            
            # Log activity
            UserActivity.objects.create(
                user=request.user,
                activity_type='tour_cancelled',
                description=f'Cancelled tour for "{tour.property.title}"'
            )
            
            return Response({'message': 'Tour cancelled successfully'})
        return Response(
            {'error': 'Cannot cancel tour in current status'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


# ================== MESSAGING SYSTEM ==================

class ConversationViewSet(ReadOnlyModelViewSet):
    """
    ViewSet for managing conversations
    """
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).distinct()

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get messages for a conversation"""
        conversation = self.get_object()
        messages = Message.objects.filter(conversation=conversation).order_by('created_at')
        
        # Mark messages as read
        messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in a conversation"""
        conversation = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response(
                {'error': 'Message content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=content
        )
        
        # Create notifications for other participants
        for participant in conversation.participants.exclude(id=request.user.id):
            Notification.objects.create(
                user=participant,
                type='new_message',
                title='New Message',
                message=f'New message from {request.user.get_full_name()}',
                related_object_id=message.id
            )
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='message_sent',
            description=f'Sent message in conversation'
        )
        
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request):
    """
    Start a new conversation with another user about a property
    """
    other_user_id = request.data.get('other_user_id')
    property_id = request.data.get('property_id')
    initial_message = request.data.get('message')
    
    if not other_user_id:
        return Response(
            {'error': 'Other user ID is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        other_user = User.objects.get(id=other_user_id)
        property_obj = Listing.objects.get(id=property_id) if property_id else None
    except (User.DoesNotExist, Listing.DoesNotExist):
        return Response(
            {'error': 'User or property not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if conversation already exists
    existing_conversation = Conversation.objects.filter(
        participants=request.user
    ).filter(
        participants=other_user
    ).filter(
        property=property_obj
    ).first()
    
    if existing_conversation:
        serializer = ConversationSerializer(existing_conversation)
        return Response(serializer.data)
    
    # Create new conversation
    conversation = Conversation.objects.create(
        property=property_obj,
        subject=f'Inquiry about {property_obj.title}' if property_obj else 'General Inquiry'
    )
    conversation.participants.add(request.user, other_user)
    
    # Send initial message if provided
    if initial_message:
        Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=initial_message
        )
        
        # Notify other user
        Notification.objects.create(
            user=other_user,
            type='new_conversation',
            title='New Conversation',
            message=f'{request.user.get_full_name()} started a conversation',
            related_object_id=conversation.id
        )
    
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ================== NOTIFICATIONS ==================

class NotificationViewSet(ModelViewSet):
    """
    ViewSet for managing notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'message': 'All notifications marked as read'})


# ================== PROPERTY ALERTS ==================

class PropertyAlertViewSet(ModelViewSet):
    """
    ViewSet for managing property alerts
    """
    serializer_class = PropertyAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PropertyAlert.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        alert = serializer.save(user=self.request.user)
        
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            activity_type='alert_created',
            description=f'Created property alert: {alert.name}'
        )

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle alert active status"""
        alert = self.get_object()
        alert.is_active = not alert.is_active
        alert.save()
        
        status_text = 'activated' if alert.is_active else 'deactivated'
        UserActivity.objects.create(
            user=request.user,
            activity_type='alert_updated',
            description=f'Alert "{alert.name}" {status_text}'
        )
        
        return Response({
            'message': f'Alert {status_text} successfully',
            'is_active': alert.is_active
        })


# ================== DOCUMENTS ==================

class DocumentViewSet(ModelViewSet):
    """
    ViewSet for managing user documents
    """
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        document = serializer.save(user=self.request.user)
        
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            activity_type='document_uploaded',
            description=f'Uploaded document: {document.name}'
        )


# ================== USER ACTIVITIES ==================

class UserActivityViewSet(ReadOnlyModelViewSet):
    """
    ReadOnly ViewSet for user activities
    """
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user).order_by('-created_at')


# ================== ADMIN VIEWS ==================

class AdminUserManagementViewSet(ModelViewSet):
    """
    Admin-only ViewSet for managing all users
    """
    serializer_class = AdminUserManagementSerializer
    permission_classes = [IsAdminUser]
    queryset = User.objects.select_related('profile').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'last_login']
    ordering = ['-date_joined']

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle user active status"""
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        
        return Response({
            'message': f'User {"activated" if user.is_active else "deactivated"} successfully',
            'is_active': user.is_active
        })

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user management statistics"""
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        staff_users = User.objects.filter(is_staff=True).count()
        recent_users = User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'staff_users': staff_users,
            'recent_registrations': recent_users,
        })


class AdminUserRegistrationAPIView(generics.CreateAPIView):
    """
    Admin-only endpoint to register new users (including admins)
    """
    queryset = User.objects.all()
    serializer_class = AdminUserRegistrationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            {
                'user': UserSerializer(user).data,
                'message': 'User created successfully by admin'
            },
            status=status.HTTP_201_CREATED
        )


# ================== UTILITY ENDPOINTS ==================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_user_activity(request):
    """
    Log a user activity
    """
    activity_type = request.data.get('activity_type')
    description = request.data.get('description', '')
    
    if not activity_type:
        return Response(
            {'error': 'Activity type is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    UserActivity.objects.create(
        user=request.user,
        activity_type=activity_type,
        description=description
    )
    
    return Response({'message': 'Activity logged successfully'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    """
    Search for users (for messaging, etc.)
    """
    query = request.GET.get('q', '')
    if len(query) < 2:
        return Response({'error': 'Query must be at least 2 characters'}, status=status.HTTP_400_BAD_REQUEST)
    
    users = User.objects.filter(
        Q(username__icontains=query) |
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(email__icontains=query)
    ).exclude(id=request.user.id)[:10]
    
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# ================== LEGACY DJANGO VIEWS ==================
# Kept for backwards compatibility

from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.models import User

def register(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        # Get form values
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        # Check if passwords match
        if password == password2:
            # Check username
            if User.objects.filter(username=username).exists():
                messages.error(request, 'That username is taken')
                return redirect('register')
            else:
                if User.objects.filter(email=email).exists():
                    messages.error(request, 'That email is being used')
                    return redirect('register')
                else:
                    # Looks good
                    user = User.objects.create_user(username=username, password=password, email=email, first_name=first_name, last_name=last_name)
                    # Create user profile
                    UserProfile.objects.get_or_create(user=user)
                    # Login after register
                    auth.login(request, user)
                    messages.success(request, 'You are now logged in')
                    return redirect('index')
        else:
            messages.error(request, 'Passwords do not match')
            return redirect('register')
    else:
        return render(request, 'accounts/register.html')

def login(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, 'You are now logged in')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid credentials')
            return redirect('login')
    else:
        return render(request, 'accounts/login.html')

def logout(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        auth.logout(request)
        messages.success(request, 'You are now logged out')
        return redirect('index')

def dashboard(request):
    """Legacy Django view - kept for backwards compatibility"""
    return render(request, 'accounts/dashboard.html')


# ================== FILE UPLOAD API ENDPOINTS ==================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_file_metadata(request):
    """
    Store file metadata after successful Vercel Blob upload
    """
    try:
        data = request.data
        
        # Create file upload record
        file_upload = FileUpload.objects.create(
            user=request.user,
            file_name=data.get('file_name'),
            original_name=data.get('original_name'),
            file_type=data.get('file_type'),
            mime_type=data.get('mime_type'),
            file_size=int(data.get('file_size', 0)),
            blob_url=data.get('blob_url'),
            blob_key=data.get('blob_key'),
            category=data.get('category', ''),
            property_id=data.get('property_id', ''),
            listing_id=data.get('listing_id') if data.get('listing_id') else None,
        )
        
        # Update user profile avatar if this is an avatar upload
        if data.get('file_type') == 'avatar':
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            profile.avatar = data.get('blob_url')
            profile.save()
        
        serializer = FileUploadSerializer(file_upload)
        return Response({
            'success': True,
            'file': serializer.data,
            'message': 'File metadata stored successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_avatar(request):
    """
    Get the user's current avatar from uploaded files
    """
    try:
        # Get user's most recent avatar from FileUpload model
        avatar_file = FileUpload.objects.filter(
            user=request.user,
            file_type='avatar',
            upload_status='completed'
        ).order_by('-uploaded_at').first()
        
        if avatar_file:
            return Response({
                'avatar_url': avatar_file.blob_url,
                'has_avatar': True,
                'uploaded_at': avatar_file.uploaded_at,
                'file_size': avatar_file.file_size
            })
        else:
            return Response({
                'avatar_url': None,
                'has_avatar': False
            })
    except Exception as e:
        logger.error(f"Error fetching user avatar: {e}")
        return Response({'error': 'Failed to fetch avatar'}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_files(request):
    """
    Get all files uploaded by the user with optional filtering
    """
    try:
        file_type = request.GET.get('file_type')
        category = request.GET.get('category')
        
        queryset = FileUpload.objects.filter(
            user=request.user,
            upload_status='completed'
        ).order_by('-uploaded_at')
        
        if file_type:
            queryset = queryset.filter(file_type=file_type)
        
        if category:
            queryset = queryset.filter(category=category)
        
        files = FileUploadSerializer(queryset, many=True).data
        return Response({
            'files': files, 
            'count': len(files),
            'filters': {
                'file_type': file_type,
                'category': category
            }
        })
    except Exception as e:
        logger.error(f"Error fetching user files: {e}")
        return Response({'error': 'Failed to fetch files'}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_property_images(request, property_id):
    """
    Get all images for a specific property with pagination
    """
    try:
        # Get pagination parameters
        page = int(request.GET.get('page', 1))
        limit = int(request.GET.get('limit', 10))
        max_limit = 50  # Prevent excessive requests
        limit = min(limit, max_limit)
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get all property images from FileUpload model with pagination
        property_images_queryset = FileUpload.objects.filter(
            property_id=property_id,
            file_type='property-image',
            upload_status='completed'
        ).order_by('uploaded_at')
        
        # Get total count before applying pagination
        total_uploaded_images = property_images_queryset.count()
        
        # Apply pagination to uploaded images
        paginated_property_images = property_images_queryset[offset:offset + limit]
        
        # Also check if property exists in listings
        traditional_photos = []
        total_traditional_photos = 0
        try:
            from listings.models import Listing
            property_obj = Listing.objects.get(id=property_id)
            
            # Get traditional photo fields as backup
            all_traditional_photos = []
            if property_obj.photo_main:
                all_traditional_photos.append({
                    'url': property_obj.photo_main,
                    'is_main': True,
                    'type': 'main'
                })
            
            for i in range(1, 7):  # photo_1 through photo_6
                photo_field = getattr(property_obj, f'photo_{i}', None)
                if photo_field:
                    all_traditional_photos.append({
                        'url': photo_field,
                        'is_main': False,
                        'type': f'photo_{i}'
                    })
            
            total_traditional_photos = len(all_traditional_photos)
            
            # If we need to include traditional photos in this page
            remaining_slots = limit - len(paginated_property_images)
            if remaining_slots > 0 and offset < total_uploaded_images + total_traditional_photos:
                traditional_offset = max(0, offset - total_uploaded_images)
                if traditional_offset < len(all_traditional_photos):
                    traditional_photos = all_traditional_photos[traditional_offset:traditional_offset + remaining_slots]
                    
        except Exception as e:
            logger.warning(f"Could not fetch traditional photos for property {property_id}: {e}")
            traditional_photos = []
            total_traditional_photos = 0
        
        uploaded_images = FileUploadSerializer(paginated_property_images, many=True).data
        
        # Calculate pagination metadata
        total_images = total_uploaded_images + total_traditional_photos
        total_pages = (total_images + limit - 1) // limit  # Ceiling division
        has_next = page < total_pages
        has_previous = page > 1
        
        return Response({
            'uploaded_images': uploaded_images,
            'traditional_photos': traditional_photos,
            'pagination': {
                'page': page,
                'limit': limit,
                'total_images': total_images,
                'total_uploaded_images': total_uploaded_images,
                'total_traditional_photos': total_traditional_photos,
                'total_pages': total_pages,
                'has_next': has_next,
                'has_previous': has_previous,
                'next_page': page + 1 if has_next else None,
                'previous_page': page - 1 if has_previous else None
            },
            'property_id': property_id
        })
    except ValueError as e:
        return Response({'error': 'Invalid pagination parameters'}, status=400)
    except Exception as e:
        logger.error(f"Error fetching property images: {e}")
        return Response({'error': 'Failed to fetch property images'}, status=500)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_file(request, file_id):
    """
    Delete a user's uploaded file (mark as deleted, don't actually delete from blob)
    """
    try:
        file_obj = FileUpload.objects.get(
            id=file_id,
            user=request.user
        )
        
        # Mark as deleted instead of actual deletion
        file_obj.upload_status = 'deleted'
        file_obj.save()
        
        return Response({
            'success': True,
            'message': 'File marked as deleted'
        })
    except FileUpload.DoesNotExist:
        return Response({'error': 'File not found'}, status=404)
    except Exception as e:
        logger.error(f"Error deleting file: {e}")
        return Response({'error': 'Failed to delete file'}, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_upload_session(request):
    """
    Create a file upload session for bulk operations
    """
    try:
        data = request.data
        
        session = FileUploadSession.objects.create(
            user=request.user,
            session_name=data.get('session_name', ''),
            upload_type=data.get('upload_type'),
            total_files=int(data.get('total_files', 0)),
            property_id=data.get('property_id', ''),
            listing_id=data.get('listing_id') if data.get('listing_id') else None,
        )
        
        return Response({
            'success': True,
            'session_id': str(session.id),
            'message': 'Upload session created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_upload_session(request, session_id):
    """
    Get upload session details
    """
    try:
        session = FileUploadSession.objects.get(
            id=session_id,
            user=request.user
        )
        
        return Response({
            'success': True,
            'session': {
                'id': str(session.id),
                'session_name': session.session_name,
                'upload_type': session.upload_type,
                'total_files': session.total_files,
                'uploaded_files': session.uploaded_files,
                'failed_files': session.failed_files,
                'session_status': session.session_status,
                'property_id': session.property_id,
                'created_at': session.created_at,
                'updated_at': session.updated_at,
            }
        })
        
    except FileUploadSession.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Upload session not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_realtor_info(request):
    """
    Get the current user's realtor information if they are a seller
    """
    user = request.user
    
    try:
        # Check if user has a realtor profile
        from realtors.models import Realtor
        realtor = Realtor.objects.get(user=user)
        
        return Response({
            'realtor_id': realtor.id,
            'name': realtor.name,
            'title': realtor.title,
            'email': realtor.email,
            'phone': realtor.phone,
            'is_active': realtor.is_active
        })
    except Realtor.DoesNotExist:
        return Response(
            {'error': 'No realtor profile found for this user'}, 
            status=status.HTTP_404_NOT_FOUND
        )


# ================== GOOGLE OAUTH2 VIEWS ==================

from .google_oauth import get_google_user_data
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db import transaction


@api_view(['POST'])
@permission_classes([])
def google_oauth_login(request):
    """
    Handle Google OAuth2 login/registration
    
    Expected payload:
    {
        "id_token": "google_id_token",
        "access_token": "google_access_token"
    }
    """
    try:
        id_token = request.data.get('id_token')
        access_token = request.data.get('access_token')
        
        if not id_token and not access_token:
            return Response(
                {'error': 'Either id_token or access_token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify Google token and get user data
        google_user_data = None
        if id_token:
            google_user_data = get_google_user_data(id_token, 'id_token')
        elif access_token:
            google_user_data = get_google_user_data(access_token, 'access_token')
        
        if not google_user_data:
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user exists by Google ID or email
        try:
            # First try to find by Google ID
            user_profile = UserProfile.objects.get(google_id=google_user_data['google_id'])
            user = user_profile.user
            
            # Update Google user data
            user_profile.google_email = google_user_data['email']
            user_profile.google_picture = google_user_data['picture']
            user_profile.google_verified = google_user_data['email_verified']
            user_profile.last_login_date = timezone.now()
            user_profile.save()
            
            logger.info(f"Existing Google user logged in: {user.email}")
            
        except UserProfile.DoesNotExist:
            # Try to find by email
            try:
                user = User.objects.get(email=google_user_data['email'])
                user_profile = user.profile
                
                # Link Google account to existing user
                user_profile.google_id = google_user_data['google_id']
                user_profile.google_email = google_user_data['email']
                user_profile.google_picture = google_user_data['picture']
                user_profile.is_google_user = True
                user_profile.google_verified = google_user_data['email_verified']
                user_profile.last_login_date = timezone.now()
                user_profile.save()
                
                logger.info(f"Linked Google account to existing user: {user.email}")
                
            except User.DoesNotExist:
                # Create new user
                with transaction.atomic():
                    # Create user
                    user = User.objects.create_user(
                        username=google_user_data['email'],  # Use email as username
                        email=google_user_data['email'],
                        first_name=google_user_data.get('given_name', ''),
                        last_name=google_user_data.get('family_name', ''),
                    )
                    
                    # Update or create user profile
                    user_profile, created = UserProfile.objects.get_or_create(
                        user=user,
                        defaults={
                            'role': 'buyer',  # Default role for new Google users
                            'google_id': google_user_data['google_id'],
                            'google_email': google_user_data['email'],
                            'google_picture': google_user_data['picture'],
                            'is_google_user': True,
                            'google_verified': google_user_data['email_verified'],
                            'is_verified': google_user_data['email_verified'],
                            'last_login_date': timezone.now(),
                        }
                    )
                    
                    logger.info(f"Created new Google user: {user.email}")
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Prepare user data response
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile': {
                'role': user_profile.role,
                'avatar': user_profile.avatar.url if user_profile.avatar else None,
                'google_picture': user_profile.google_picture,
                'is_google_user': user_profile.is_google_user,
                'is_verified': user_profile.is_verified,
            }
        }
        
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'user': user_data,
            'message': 'Google OAuth2 login successful'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Google OAuth2 login error: {str(e)}")
        return Response(
            {'error': 'Internal server error during Google OAuth2 login'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def link_google_account(request):
    """
    Link Google account to existing authenticated user
    """
    try:
        id_token = request.data.get('id_token')
        access_token = request.data.get('access_token')
        
        if not id_token and not access_token:
            return Response(
                {'error': 'Either id_token or access_token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify Google token
        google_user_data = None
        if id_token:
            google_user_data = get_google_user_data(id_token, 'id_token')
        elif access_token:
            google_user_data = get_google_user_data(access_token, 'access_token')
        
        if not google_user_data:
            return Response(
                {'error': 'Invalid Google token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if Google account is already linked to another user
        if UserProfile.objects.filter(google_id=google_user_data['google_id']).exclude(user=request.user).exists():
            return Response(
                {'error': 'This Google account is already linked to another user'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Link Google account to current user
        user_profile = request.user.profile
        user_profile.google_id = google_user_data['google_id']
        user_profile.google_email = google_user_data['email']
        user_profile.google_picture = google_user_data['picture']
        user_profile.is_google_user = True
        user_profile.google_verified = google_user_data['email_verified']
        user_profile.save()
        
        logger.info(f"Linked Google account to user: {request.user.email}")
        
        return Response({
            'message': 'Google account linked successfully',
            'google_email': google_user_data['email'],
            'google_verified': google_user_data['email_verified']
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Google account linking error: {str(e)}")
        return Response(
            {'error': 'Internal server error during Google account linking'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unlink_google_account(request):
    """
    Unlink Google account from authenticated user
    """
    try:
        user_profile = request.user.profile
        
        if not user_profile.is_google_user:
            return Response(
                {'error': 'No Google account linked to this user'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Unlink Google account
        user_profile.google_id = None
        user_profile.google_email = None
        user_profile.google_picture = None
        user_profile.is_google_user = False
        user_profile.google_verified = False
        user_profile.save()
        
        logger.info(f"Unlinked Google account from user: {request.user.email}")
        
        return Response({
            'message': 'Google account unlinked successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Google account unlinking error: {str(e)}")
        return Response(
            {'error': 'Internal server error during Google account unlinking'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
