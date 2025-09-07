from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from django.db import models
import logging
from .models import Contact
from .serializers import ContactSerializer, ContactCreateSerializer, ContactUpdateSerializer
from .tasks import send_contact_notifications

logger = logging.getLogger(__name__)


class ContactCreateAPIView(generics.CreateAPIView):
    """
    Create a new contact inquiry
    """
    queryset = Contact.objects.all()
    serializer_class = ContactCreateSerializer
    # No authentication required for contact form submissions
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        contact = serializer.save()
        
        # Log the contact creation
        logger.info(f"New contact created: #{contact.id} - {contact.name} ({contact.get_contact_type_display()})")
        
        # Send notifications asynchronously using Celery
        try:
            # Queue the notification task for background processing
            send_contact_notifications.delay(contact.id)
            logger.info(f"Notification task queued for contact #{contact.id}")
        except Exception as e:
            # If Celery is not available, fall back to synchronous notifications
            logger.warning(f"Celery task failed, falling back to synchronous notifications: {str(e)}")
            
            try:
                from .notifications import NotificationManager
                NotificationManager.send_all_notifications(contact)
            except Exception as sync_error:
                logger.error(f"Synchronous notifications also failed for contact #{contact.id}: {str(sync_error)}")
                # Don't fail the request even if notifications fail
        
        # Return success response
        response_data = {
            'contact': ContactSerializer(contact).data,
            'message': self._get_success_message(contact),
            'notification_status': 'queued'  # Indicates notifications are being processed
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    def _get_success_message(self, contact) -> str:
        """Get appropriate success message based on contact type"""
        message_map = {
            'consultation': f'Thank you {contact.name}! Your consultation request has been submitted successfully. Our team will contact you within 24 hours.',
            'newsletter': f'Welcome {contact.name}! You have been successfully subscribed to our newsletter.',
            'general': f'Thank you {contact.name}! Your inquiry has been submitted successfully. We will get back to you soon.',
            'property_inquiry': f'Thank you {contact.name}! Your property inquiry has been submitted successfully. Our team will contact you shortly.',
        }
        
        return message_map.get(
            contact.contact_type,
            f'Thank you {contact.name}! Your message has been submitted successfully.'
        )


class ContactListAPIView(generics.ListAPIView):
    """
    List all contacts (authenticated users only)
    """
    queryset = Contact.objects.all().order_by('-contact_date')
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter contacts based on query parameters"""
        queryset = super().get_queryset()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        # Filter by contact type
        contact_type_filter = self.request.query_params.get('contact_type')
        if contact_type_filter:
            queryset = queryset.filter(contact_type=contact_type_filter)
            
        # Search by name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) | 
                models.Q(email__icontains=search)
            )
            
        return queryset


class ContactDetailAPIView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update a specific contact by ID (authenticated users only)
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """Use different serializer for updates"""
        if self.request.method in ['PUT', 'PATCH']:
            return ContactUpdateSerializer
        return ContactSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_contacts(request):
    """
    Get contacts for the current user
    """
    try:
        contacts = Contact.objects.filter(user_id=request.user.id).order_by('-contact_date')
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch user contacts'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def contact_stats(request):
    """
    Get contact statistics for admin dashboard
    """
    try:
        from django.db.models import Count, Q
        from datetime import datetime, timedelta
        
        # Get basic stats
        total_contacts = Contact.objects.count()
        new_contacts = Contact.objects.filter(status='new').count()
        today = datetime.now().date()
        this_week = today - timedelta(days=7)
        
        # Get status breakdown
        status_stats = Contact.objects.values('status').annotate(count=Count('id'))
        
        # Get recent contacts (last 7 days)
        recent_contacts = Contact.objects.filter(
            contact_date__gte=this_week
        ).count()
        
        return Response({
            'total_contacts': total_contacts,
            'new_contacts': new_contacts,
            'recent_contacts': recent_contacts,
            'status_breakdown': list(status_stats),
        })
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch contact stats'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Legacy Django views for backwards compatibility
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail

def contact(request):
    """Legacy Django view - kept for backwards compatibility"""
    if request.method == 'POST':
        listing_id = request.POST['listing_id']
        listing = request.POST['listing']
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        message = request.POST['message']
        user_id = request.POST['user_id']
        realtor_email = request.POST['realtor_email']

        #  Check if user has made inquiry already
        if request.user.is_authenticated:
            user_id = request.user.id
            has_contacted = Contact.objects.all().filter(listing_id=listing_id, user_id=user_id)
            if has_contacted:
                messages.error(request, 'You have already made an inquiry for this listing')
                return redirect('/listings/'+listing_id)

        contact = Contact(listing=listing, listing_id=listing_id, name=name, email=email, phone=phone, message=message, user_id=user_id)

        contact.save()

        # Send email
        send_mail(
            'Property Listing Inquiry',
            'There has been an inquiry for ' + listing + '. Sign into the admin panel for more info',
            'traversy.brad@gmail.com',
            [realtor_email, 'admin@bradtraversy.com'],
            fail_silently=False
        )

        messages.success(request, 'Your request has been submitted, a realtor will get back to you soon')
        return redirect('/listings/'+listing_id)
