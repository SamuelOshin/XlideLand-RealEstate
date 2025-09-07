"""
Celery tasks for asynchronous notification processing
"""
from celery import shared_task
from django.apps import apps
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_contact_notifications(self, contact_id):
    """
    Async task to send all notifications for a contact
    
    Args:
        contact_id: ID of the contact instance
        
    Returns:
        dict: Results of notification sending
    """
    try:
        # Import here to avoid circular imports
        from .notifications import NotificationManager
        
        # Get contact instance
        Contact = apps.get_model('contacts', 'Contact')
        contact = Contact.objects.get(id=contact_id)
        
        # Send all notifications
        results = NotificationManager.send_all_notifications(contact)
        
        logger.info(f"Contact notifications task completed for contact #{contact_id}: {results}")
        return results
        
    except Exception as e:
        logger.error(f"Contact notifications task failed for contact #{contact_id}: {str(e)}")
        # Retry the task if it fails
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_admin_email_notification(self, contact_id):
    """
    Async task to send admin email notification
    
    Args:
        contact_id: ID of the contact instance
    """
    try:
        from .notifications import EmailNotificationService
        
        Contact = apps.get_model('contacts', 'Contact')
        contact = Contact.objects.get(id=contact_id)
        
        result = EmailNotificationService.send_admin_notification(contact)
        
        if result:
            logger.info(f"Admin email notification sent for contact #{contact_id}")
        else:
            logger.warning(f"Admin email notification failed for contact #{contact_id}")
            
        return result
        
    except Exception as e:
        logger.error(f"Admin email notification task failed for contact #{contact_id}: {str(e)}")
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_user_email_confirmation(self, contact_id):
    """
    Async task to send user email confirmation
    
    Args:
        contact_id: ID of the contact instance
    """
    try:
        from .notifications import EmailNotificationService
        
        Contact = apps.get_model('contacts', 'Contact')
        contact = Contact.objects.get(id=contact_id)
        
        result = EmailNotificationService.send_user_confirmation(contact)
        
        if result:
            logger.info(f"User email confirmation sent for contact #{contact_id}")
        else:
            logger.warning(f"User email confirmation failed for contact #{contact_id}")
            
        return result
        
    except Exception as e:
        logger.error(f"User email confirmation task failed for contact #{contact_id}: {str(e)}")
        raise self.retry(exc=e)


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_whatsapp_notifications(self, contact_id):
    """
    Async task to send WhatsApp notifications
    
    Args:
        contact_id: ID of the contact instance
    """
    try:
        from .notifications import WhatsAppNotificationService
        
        Contact = apps.get_model('contacts', 'Contact')
        contact = Contact.objects.get(id=contact_id)
        
        results = {
            'admin_whatsapp': WhatsAppNotificationService.send_admin_notification(contact),
            'user_whatsapp': False
        }
        
        # Send user WhatsApp if phone number is provided
        if contact.phone:
            results['user_whatsapp'] = WhatsAppNotificationService.send_user_confirmation(contact)
        
        logger.info(f"WhatsApp notifications completed for contact #{contact_id}: {results}")
        return results
        
    except Exception as e:
        logger.error(f"WhatsApp notifications task failed for contact #{contact_id}: {str(e)}")
        raise self.retry(exc=e)


@shared_task
def cleanup_old_contact_notifications():
    """
    Cleanup task to remove old notification logs
    This can be scheduled to run daily to maintain database performance
    """
    try:
        from datetime import datetime, timedelta
        
        # Remove notification logs older than 90 days
        cutoff_date = datetime.now() - timedelta(days=90)
        
        # If you add a NotificationLog model later, clean it up here
        # NotificationLog.objects.filter(created_at__lt=cutoff_date).delete()
        
        logger.info("Contact notification cleanup completed")
        return True
        
    except Exception as e:
        logger.error(f"Contact notification cleanup failed: {str(e)}")
        return False


@shared_task
def test_notification_system():
    """
    Test task to verify notification system is working
    Useful for monitoring and health checks
    """
    try:
        from django.conf import settings
        
        test_results = {
            'email_configured': bool(settings.EMAIL_HOST_USER),
            'whatsapp_configured': bool(settings.WHATSAPP_BUSINESS_API_TOKEN),
            'notifications_enabled': settings.SEND_EMAIL_NOTIFICATIONS,
            'confirmations_enabled': settings.SEND_USER_CONFIRMATIONS,
        }
        
        logger.info(f"Notification system test completed: {test_results}")
        return test_results
        
    except Exception as e:
        logger.error(f"Notification system test failed: {str(e)}")
        return {'error': str(e)}
