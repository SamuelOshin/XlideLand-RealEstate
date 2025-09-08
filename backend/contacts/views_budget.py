"""
Updated views using budget-friendly notification alternatives
Choose your preferred method based on your needs
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.conf import settings
import logging

from .models import Contact
from .serializers import ContactSerializer

# Import notification alternatives
from .simple_notifications import send_contact_notifications  # Threading approach
from .database_queue import task_processor  # Database queue approach

logger = logging.getLogger(__name__)


class ContactCreateAPIView(APIView):
    """
    Handle contact form submissions with budget-friendly notifications
    """
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def post(self, request):
        try:
            serializer = ContactSerializer(data=request.data)
            
            if serializer.is_valid():
                # Save contact to database
                contact = serializer.save()
                
                # Prepare contact data for notifications
                contact_data = {
                    'id': contact.id,
                    'name': contact.name,
                    'email': contact.email,
                    'phone': contact.phone,
                    'message': contact.message,
                    'contact_date': contact.contact_date.isoformat(),  # Use correct field name
                }
                
                # Choose your notification method:
                
                # OPTION 1: Simple Threading (Immediate, no external dependencies)
                # Use this for small to medium traffic
                if getattr(settings, 'USE_THREADING_NOTIFICATIONS', True):
                    send_contact_notifications(contact_data)
                    logger.info(f"Contact saved and notifications queued (threading): {contact.email}")
                
                # OPTION 2: Database Queue (More reliable, handles failures better)
                # Use this for higher traffic or when you need retry mechanisms
                elif getattr(settings, 'USE_DATABASE_QUEUE', False):
                    task_processor.queue_contact_notifications(contact_data)
                    logger.info(f"Contact saved and notifications queued (database): {contact.email}")
                
                # OPTION 3: Synchronous (Simple but can slow down API)
                # Use this for very low traffic or testing
                else:
                    from .simple_notifications import notification_service
                    notification_service._process_notifications(contact_data)
                    logger.info(f"Contact saved and notifications sent (synchronous): {contact.email}")
                
                return Response({
                    'status': 'success',
                    'message': 'Contact form submitted successfully',
                    'contact_id': contact.id
                }, status=status.HTTP_201_CREATED)
            
            else:
                return Response({
                    'status': 'error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Error processing contact form: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'An error occurred while processing your request'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
