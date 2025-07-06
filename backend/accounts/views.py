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
    PropertyAlert, Document, Notification, UserActivity
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
    AdminUserManagementSerializer
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
