"""
Management command to process database notification queue
Run this periodically with cron job or task scheduler
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import models
from contacts.database_queue import task_processor
from contacts.models import NotificationQueue  # Import from models.py


class Command(BaseCommand):
    help = 'Process pending notification tasks from database queue'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size',
            type=int,
            default=10,
            help='Number of tasks to process in one batch',
        )
        parser.add_argument(
            '--retry-failed',
            action='store_true',
            help='Retry failed tasks that haven\'t exceeded max retries',
        )
        parser.add_argument(
            '--cleanup',
            action='store_true',
            help='Clean up old completed tasks',
        )
        parser.add_argument(
            '--status',
            action='store_true',
            help='Show queue status',
        )

    def handle(self, *args, **options):
        if options['status']:
            self._show_status()
        
        if options['retry_failed']:
            self._retry_failed_tasks()
        
        if options['cleanup']:
            self._cleanup_old_tasks()
        
        # Process pending tasks
        batch_size = options['batch_size']
        self._process_tasks(batch_size)

    def _show_status(self):
        """Show current queue status"""
        self.stdout.write(self.style.SUCCESS('📊 Notification Queue Status'))
        self.stdout.write('=' * 40)
        
        # Count tasks by status
        for status_choice in NotificationQueue.STATUS_CHOICES:
            status_code = status_choice[0]
            status_name = status_choice[1]
            count = NotificationQueue.objects.filter(status=status_code).count()
            self.stdout.write(f'{status_name}: {count}')
        
        # Show recent tasks
        recent_tasks = NotificationQueue.objects.order_by('-created_at')[:5]
        if recent_tasks:
            self.stdout.write('\n📋 Recent Tasks:')
            for task in recent_tasks:
                self.stdout.write(f'  {task.task_type} - {task.status} - {task.created_at}')

    def _retry_failed_tasks(self):
        """Retry failed tasks"""
        self.stdout.write('🔄 Retrying failed tasks...')
        
        failed_count = NotificationQueue.objects.filter(
            status='failed'
        ).filter(retry_count__lt=models.F('max_retries')).count()
        
        if failed_count > 0:
            task_processor.retry_failed_tasks()
            self.stdout.write(f'  ✅ Queued {failed_count} failed tasks for retry')
        else:
            self.stdout.write('  ℹ️  No failed tasks to retry')

    def _cleanup_old_tasks(self):
        """Clean up old completed tasks"""
        self.stdout.write('🧹 Cleaning up old tasks...')
        
        # Delete completed tasks older than 7 days
        cutoff_date = timezone.now() - timezone.timedelta(days=7)
        old_tasks = NotificationQueue.objects.filter(
            status='completed',
            processed_at__lt=cutoff_date
        )
        
        count = old_tasks.count()
        if count > 0:
            old_tasks.delete()
            self.stdout.write(f'  ✅ Deleted {count} old completed tasks')
        else:
            self.stdout.write('  ℹ️  No old tasks to clean up')

    def _process_tasks(self, batch_size):
        """Process pending tasks"""
        pending_count = NotificationQueue.objects.filter(status='pending').count()
        
        if pending_count == 0:
            self.stdout.write('ℹ️  No pending tasks to process')
            return
        
        self.stdout.write(f'⚡ Processing {min(pending_count, batch_size)} pending tasks...')
        
        try:
            task_processor.process_pending_tasks(batch_size)
            
            # Show results
            remaining = NotificationQueue.objects.filter(status='pending').count()
            processed = pending_count - remaining
            
            self.stdout.write(f'  ✅ Processed {processed} tasks')
            if remaining > 0:
                self.stdout.write(f'  ℹ️  {remaining} tasks remaining')
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error processing tasks: {str(e)}'))
