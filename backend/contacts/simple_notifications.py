"""
Budget-friendly notification system using Python threading
No external services required - uses existing database and threading
"""
import threading
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import requests
import time


logger = logging.getLogger(__name__)


class ThreadedNotificationService:
    """
    Simple threaded notification service that doesn't require Redis/Celery
    Uses Python's built-in threading for background processing
    """
    
    def __init__(self):
        self.email_enabled = getattr(settings, 'SEND_EMAIL_NOTIFICATIONS', True)
        self.whatsapp_enabled = getattr(settings, 'SEND_WHATSAPP_NOTIFICATIONS', False)
    
    def send_notifications_async(self, contact_data):
        """
        Send notifications in background thread
        """
        thread = threading.Thread(
            target=self._process_notifications,
            args=(contact_data,),
            daemon=True  # Dies when main process dies
        )
        thread.start()
        logger.info(f"Started notification thread for contact: {contact_data.get('email', 'Unknown')}")
    
    def _process_notifications(self, contact_data):
        """
        Process notifications in background thread with error handling
        """
        try:
            # Add small delay to prevent overwhelming email servers
            time.sleep(1)
            
            if self.email_enabled:
                self._send_email_notifications(contact_data)
            
            if self.whatsapp_enabled:
                self._send_whatsapp_notification(contact_data)
                
        except Exception as e:
            logger.error(f"Error in notification thread: {str(e)}")
    
    def _send_email_notifications(self, contact_data):
        """Send email notifications"""
        try:
            # Send admin notification
            self._send_admin_email(contact_data)
            
            # Send user confirmation
            if getattr(settings, 'SEND_USER_CONFIRMATIONS', True):
                self._send_user_confirmation(contact_data)
                
        except Exception as e:
            logger.error(f"Email notification error: {str(e)}")
    
    def _send_admin_email(self, contact_data):
        """Send email to admin"""
        try:
            context = {
                'contact': contact_data,
                'admin_dashboard_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/admin/contacts/contact/"
            }
            
            html_message = render_to_string('contacts/emails/admin_notification.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=f"New Contact Form Submission - {contact_data.get('name', 'Unknown')}",
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ADMIN_EMAIL],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Admin email sent for contact: {contact_data.get('email')}")
            
        except Exception as e:
            logger.error(f"Failed to send admin email: {str(e)}")
    
    def _send_user_confirmation(self, contact_data):
        """Send confirmation email to user"""
        try:
            context = {
                'contact': contact_data,
                'company_name': 'XlideLand',
                'support_email': settings.ADMIN_EMAIL,
            }
            
            html_message = render_to_string('contacts/emails/user_confirmation.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject="Thank you for your consultation request - XlideLand",
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact_data.get('email')],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"User confirmation sent to: {contact_data.get('email')}")
            
        except Exception as e:
            logger.error(f"Failed to send user confirmation: {str(e)}")
    
    def _send_whatsapp_notification(self, contact_data):
        """Send WhatsApp notification (if configured)"""
        if not self.whatsapp_enabled:
            return
            
        try:
            # Format phone number
            phone = contact_data.get('phone', '').strip()
            if not phone:
                return
                
            if not phone.startswith('+'):
                phone = '+1' + phone.lstrip('1')  # Assume US number if no country code
            
            # Send WhatsApp message
            url = f"https://graph.facebook.com/v17.0/{settings.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages"
            
            headers = {
                'Authorization': f'Bearer {settings.WHATSAPP_BUSINESS_API_TOKEN}',
                'Content-Type': 'application/json',
            }
            
            message_data = {
                'messaging_product': 'whatsapp',
                'to': phone,
                'type': 'text',
                'text': {
                    'body': f"Hi {contact_data.get('name', 'there')}! Thank you for your consultation request with XlideLand. We'll get back to you within 24 hours. 🏠✨"
                }
            }
            
            response = requests.post(url, json=message_data, headers=headers, timeout=10)
            
            if response.status_code == 200:
                logger.info(f"WhatsApp message sent to: {phone}")
            else:
                logger.error(f"WhatsApp API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"WhatsApp notification error: {str(e)}")


# Global instance
notification_service = ThreadedNotificationService()


def send_contact_notifications(contact_data):
    """
    Main function to send notifications
    Call this from your views
    """
    notification_service.send_notifications_async(contact_data)
