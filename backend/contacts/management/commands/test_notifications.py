"""
Management command to test notification system
Usage: python manage.py test_notifications
"""
from django.core.management.base import BaseCommand
from django.conf import settings
from contacts.models import Contact
from contacts.notifications import NotificationManager, EmailNotificationService, WhatsAppNotificationService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Test the notification system with a sample contact'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email-only',
            action='store_true',
            help='Test only email notifications',
        )
        parser.add_argument(
            '--whatsapp-only',
            action='store_true',
            help='Test only WhatsApp notifications',
        )
        parser.add_argument(
            '--contact-id',
            type=int,
            help='Use specific contact ID for testing',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🧪 Testing Notification System'))
        self.stdout.write('=' * 50)

        # Check configuration
        self._check_configuration()

        # Get or create test contact
        if options['contact_id']:
            try:
                contact = Contact.objects.get(id=options['contact_id'])
                self.stdout.write(f"Using existing contact #{contact.id}: {contact.name}")
            except Contact.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Contact #{options['contact_id']} not found"))
                return
        else:
            contact = self._create_test_contact()

        # Test notifications based on options
        if options['email_only']:
            self._test_email_notifications(contact)
        elif options['whatsapp_only']:
            self._test_whatsapp_notifications(contact)
        else:
            self._test_all_notifications(contact)

        self.stdout.write(self.style.SUCCESS('\n✅ Notification testing completed'))

    def _check_configuration(self):
        """Check notification system configuration"""
        self.stdout.write('\n📋 Configuration Check:')
        
        # Email configuration
        email_configured = bool(settings.EMAIL_HOST_USER)
        self.stdout.write(f"  📧 Email: {'✅ Configured' if email_configured else '❌ Not configured'}")
        
        # WhatsApp configuration
        whatsapp_configured = bool(
            settings.WHATSAPP_BUSINESS_API_TOKEN and 
            settings.WHATSAPP_BUSINESS_PHONE_NUMBER_ID
        )
        self.stdout.write(f"  💬 WhatsApp: {'✅ Configured' if whatsapp_configured else '❌ Not configured'}")
        
        # Settings
        self.stdout.write(f"  🔔 Email Notifications: {'✅ Enabled' if settings.SEND_EMAIL_NOTIFICATIONS else '❌ Disabled'}")
        self.stdout.write(f"  📨 User Confirmations: {'✅ Enabled' if settings.SEND_USER_CONFIRMATIONS else '❌ Disabled'}")
        self.stdout.write(f"  💬 WhatsApp Notifications: {'✅ Enabled' if settings.SEND_WHATSAPP_NOTIFICATIONS else '❌ Disabled'}")

    def _create_test_contact(self):
        """Create a test contact for notification testing"""
        self.stdout.write('\n🧪 Creating test contact...')
        
        contact = Contact.objects.create(
            name='Test User',
            email='test@example.com',
            phone='+2341234567890',
            subject='Test Consultation Request',
            message='This is a test message for notification system validation.',
            contact_type='consultation'
        )
        
        self.stdout.write(f"  ✅ Test contact created: #{contact.id}")
        return contact

    def _test_email_notifications(self, contact):
        """Test email notifications"""
        self.stdout.write('\n📧 Testing Email Notifications:')
        
        # Test admin notification
        self.stdout.write('  🔸 Testing admin notification...')
        admin_result = EmailNotificationService.send_admin_notification(contact)
        self.stdout.write(f"    {'✅ Success' if admin_result else '❌ Failed'}")
        
        # Test user confirmation
        self.stdout.write('  🔸 Testing user confirmation...')
        user_result = EmailNotificationService.send_user_confirmation(contact)
        self.stdout.write(f"    {'✅ Success' if user_result else '❌ Failed'}")

    def _test_whatsapp_notifications(self, contact):
        """Test WhatsApp notifications"""
        self.stdout.write('\n💬 Testing WhatsApp Notifications:')
        
        # Test admin notification
        self.stdout.write('  🔸 Testing admin WhatsApp...')
        admin_result = WhatsAppNotificationService.send_admin_notification(contact)
        self.stdout.write(f"    {'✅ Success' if admin_result else '❌ Failed'}")
        
        # Test user confirmation
        self.stdout.write('  🔸 Testing user WhatsApp...')
        user_result = WhatsAppNotificationService.send_user_confirmation(contact)
        self.stdout.write(f"    {'✅ Success' if user_result else '❌ Failed'}")

    def _test_all_notifications(self, contact):
        """Test all notifications using NotificationManager"""
        self.stdout.write('\n🎯 Testing All Notifications:')
        
        results = NotificationManager.send_all_notifications(contact)
        
        self.stdout.write('  📧 Email Results:')
        self.stdout.write(f"    Admin: {'✅ Success' if results.get('admin_email') else '❌ Failed'}")
        self.stdout.write(f"    User:  {'✅ Success' if results.get('user_email') else '❌ Failed'}")
        
        self.stdout.write('  💬 WhatsApp Results:')
        self.stdout.write(f"    Admin: {'✅ Success' if results.get('admin_whatsapp') else '❌ Failed'}")
        self.stdout.write(f"    User:  {'✅ Success' if results.get('user_whatsapp') else '❌ Failed'}")
        
        # Summary
        success_count = sum(1 for result in results.values() if result)
        total_count = len(results)
        
        if success_count == total_count:
            self.stdout.write(self.style.SUCCESS(f'\n🎉 All {total_count} notifications sent successfully!'))
        elif success_count > 0:
            self.stdout.write(self.style.WARNING(f'\n⚠️  {success_count}/{total_count} notifications sent successfully'))
        else:
            self.stdout.write(self.style.ERROR(f'\n❌ All {total_count} notifications failed'))
