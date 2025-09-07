"""
Celery configuration for XlideLand Backend
"""
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('xlideland')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


# Celery Beat Schedule for periodic tasks
app.conf.beat_schedule = {
    'cleanup-old-notifications': {
        'task': 'contacts.tasks.cleanup_old_contact_notifications',
        'schedule': 86400.0,  # Run daily (24 hours)
    },
    'test-notification-system': {
        'task': 'contacts.tasks.test_notification_system',
        'schedule': 3600.0,  # Run hourly for monitoring
    },
}

app.conf.timezone = 'UTC'

# Error handling configuration
app.conf.task_soft_time_limit = 300  # 5 minutes
app.conf.task_time_limit = 600  # 10 minutes
app.conf.worker_prefetch_multiplier = 1
app.conf.task_acks_late = True
app.conf.worker_disable_rate_limits = False
