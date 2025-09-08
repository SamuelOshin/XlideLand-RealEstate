"""
Alternative notification system using Django-Q with SQLite
No Redis required - uses your existing database
"""
from django.utils import timezone
import json


class DatabaseTaskProcessor:
    """
    Process notification tasks from database queue
    """
    
    def __init__(self):
        from .simple_notifications import notification_service
        self.notification_service = notification_service
    
    def queue_contact_notifications(self, contact_data):
        """
        Queue all notification tasks for a contact
        """
        from .models import NotificationQueue  # Import from models.py
        
        # Queue admin email
        NotificationQueue.objects.create(
            task_type='email_admin',
            contact_data=contact_data
        )
        
        # Queue user confirmation
        if contact_data.get('email'):
            NotificationQueue.objects.create(
                task_type='email_user',
                contact_data=contact_data
            )
        
        # Queue WhatsApp notification
        if contact_data.get('phone'):
            NotificationQueue.objects.create(
                task_type='whatsapp',
                contact_data=contact_data
            )
    
    def process_pending_tasks(self, batch_size=10):
        """
        Process pending notification tasks
        Call this from a management command or cron job
        """
        from .models import NotificationQueue  # Import from models.py
        
        pending_tasks = NotificationQueue.objects.filter(
            status='pending'
        ).order_by('created_at')[:batch_size]
        
        for task in pending_tasks:
            try:
                task.status = 'processing'
                task.save()
                
                self._process_single_task(task)
                task.mark_completed()
                
            except Exception as e:
                task.mark_failed(str(e))
    
    def _process_single_task(self, task):
        """Process a single notification task"""
        contact_data = task.contact_data
        
        if task.task_type == 'email_admin':
            self.notification_service._send_admin_email(contact_data)
        
        elif task.task_type == 'email_user':
            self.notification_service._send_user_confirmation(contact_data)
        
        elif task.task_type == 'whatsapp':
            self.notification_service._send_whatsapp_notification(contact_data)
    
    def retry_failed_tasks(self):
        """Retry failed tasks that haven't exceeded max retries"""
        from .models import NotificationQueue  # Import from models.py
        from django.db import models
        
        failed_tasks = NotificationQueue.objects.filter(
            status='failed'
        ).filter(retry_count__lt=models.F('max_retries'))
        
        for task in failed_tasks:
            task.status = 'pending'
            task.save()


# Global processor instance
task_processor = DatabaseTaskProcessor()
