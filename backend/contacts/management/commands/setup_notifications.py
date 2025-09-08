"""
Management command to configure notification system
Usage: python manage.py setup_notifications
"""
from django.core.management.base import BaseCommand
from django.conf import settings
import os


class Command(BaseCommand):
    help = 'Setup and configure the notification system'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check-config',
            action='store_true',
            help='Check current notification configuration',
        )
        parser.add_argument(
            '--email-test',
            action='store_true',
            help='Test email configuration',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🔧 Notification System Setup'))
        self.stdout.write('=' * 50)

        if options['check_config']:
            self._check_configuration()
        elif options['email_test']:
            self._test_email_config()
        else:
            self._setup_notifications()

    def _setup_notifications(self):
        """Setup notification system"""
        self.stdout.write('\n📋 Setting up notification system...')
        
        # Check requirements
        self._check_requirements()
        
        # Create necessary directories
        self._create_directories()
        
        # Check environment variables
        self._check_environment()
        
        # Provide setup instructions
        self._provide_instructions()

    def _check_requirements(self):
        """Check if required packages are installed"""
        self.stdout.write('\n📦 Checking requirements...')
        
        try:
            import celery
            self.stdout.write('  ✅ Celery installed')
        except ImportError:
            self.stdout.write('  ❌ Celery not installed - run: pip install celery[redis]')
        
        try:
            import requests
            self.stdout.write('  ✅ Requests installed')
        except ImportError:
            self.stdout.write('  ❌ Requests not installed - run: pip install requests')

    def _create_directories(self):
        """Create necessary directories"""
        self.stdout.write('\n📁 Creating directories...')
        
        # Logs directory
        logs_dir = os.path.join(settings.BASE_DIR, 'logs')
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
            self.stdout.write(f'  ✅ Created logs directory: {logs_dir}')
        else:
            self.stdout.write(f'  ✅ Logs directory exists: {logs_dir}')

    def _check_configuration(self):
        """Check current configuration"""
        self.stdout.write('\n📋 Current Configuration:')
        
        # Email settings
        self.stdout.write('\n📧 Email Configuration:')
        self.stdout.write(f'  Backend: {getattr(settings, "EMAIL_BACKEND", "Not set")}')
        self.stdout.write(f'  Host: {getattr(settings, "EMAIL_HOST", "Not set")}')
        self.stdout.write(f'  Port: {getattr(settings, "EMAIL_PORT", "Not set")}')
        self.stdout.write(f'  Use TLS: {getattr(settings, "EMAIL_USE_TLS", "Not set")}')
        self.stdout.write(f'  User: {getattr(settings, "EMAIL_HOST_USER", "Not set")}')
        self.stdout.write(f'  Password: {"Set" if getattr(settings, "EMAIL_HOST_PASSWORD", None) else "Not set"}')
        self.stdout.write(f'  From Email: {getattr(settings, "DEFAULT_FROM_EMAIL", "Not set")}')
        self.stdout.write(f'  Admin Email: {getattr(settings, "ADMIN_EMAIL", "Not set")}')
        
        # WhatsApp settings
        self.stdout.write('\n💬 WhatsApp Configuration:')
        self.stdout.write(f'  API Token: {"Set" if getattr(settings, "WHATSAPP_BUSINESS_API_TOKEN", None) else "Not set"}')
        self.stdout.write(f'  Phone Number ID: {"Set" if getattr(settings, "WHATSAPP_BUSINESS_PHONE_NUMBER_ID", None) else "Not set"}')
        self.stdout.write(f'  Webhook Token: {"Set" if getattr(settings, "WHATSAPP_WEBHOOK_VERIFY_TOKEN", None) else "Not set"}')
        
        # Notification settings
        self.stdout.write('\n🔔 Notification Settings:')
        self.stdout.write(f'  Email Notifications: {getattr(settings, "SEND_EMAIL_NOTIFICATIONS", "Not set")}')
        self.stdout.write(f'  User Confirmations: {getattr(settings, "SEND_USER_CONFIRMATIONS", "Not set")}')
        self.stdout.write(f'  WhatsApp Notifications: {getattr(settings, "SEND_WHATSAPP_NOTIFICATIONS", "Not set")}')
        
        # Celery settings
        self.stdout.write('\n⚙️ Celery Configuration:')
        self.stdout.write(f'  Broker URL: {getattr(settings, "CELERY_BROKER_URL", "Not set")}')
        self.stdout.write(f'  Result Backend: {getattr(settings, "CELERY_RESULT_BACKEND", "Not set")}')

    def _check_environment(self):
        """Check environment variables"""
        self.stdout.write('\n🌍 Environment Variables:')
        
        required_vars = [
            'EMAIL_HOST_USER',
            'EMAIL_HOST_PASSWORD',
            'DEFAULT_FROM_EMAIL',
            'ADMIN_EMAIL',
        ]
        
        optional_vars = [
            'WHATSAPP_BUSINESS_API_TOKEN',
            'WHATSAPP_BUSINESS_PHONE_NUMBER_ID',
            'CELERY_BROKER_URL',
        ]
        
        for var in required_vars:
            value = os.getenv(var)
            status = '✅ Set' if value else '❌ Not set'
            self.stdout.write(f'  {var}: {status}')
        
        self.stdout.write('\n  Optional variables:')
        for var in optional_vars:
            value = os.getenv(var)
            status = '✅ Set' if value else '⚠️  Not set'
            self.stdout.write(f'  {var}: {status}')

    def _test_email_config(self):
        """Test email configuration"""
        self.stdout.write('\n📧 Testing Email Configuration...')
        
        try:
            from django.core.mail import send_mail
            
            send_mail(
                'XlideLand - Email Configuration Test',
                'This is a test email to verify your email configuration is working correctly.',
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
            
            self.stdout.write(self.style.SUCCESS('  ✅ Test email sent successfully!'))
            self.stdout.write(f'  Check {settings.ADMIN_EMAIL} for the test email.')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'  ❌ Email test failed: {str(e)}'))

    def _provide_instructions(self):
        """Provide setup instructions"""
        self.stdout.write('\n📖 Setup Instructions:')
        
        self.stdout.write('\n1. 📧 Email Configuration:')
        self.stdout.write('   - Set EMAIL_HOST_USER to your Gmail address')
        self.stdout.write('   - Set EMAIL_HOST_PASSWORD to your Gmail App Password')
        self.stdout.write('   - Generate App Password: https://support.google.com/accounts/answer/185833')
        
        self.stdout.write('\n2. 💬 WhatsApp Business API (Optional):')
        self.stdout.write('   - Sign up for WhatsApp Business API')
        self.stdout.write('   - Get your API token and phone number ID')
        self.stdout.write('   - Set WHATSAPP_BUSINESS_API_TOKEN and WHATSAPP_BUSINESS_PHONE_NUMBER_ID')
        
        self.stdout.write('\n3. ⚙️ Celery Setup (For production):')
        self.stdout.write('   - Install Redis: sudo apt-get install redis-server')
        self.stdout.write('   - Start Redis: redis-server')
        self.stdout.write('   - Start Celery worker: celery -A core worker -l info')
        self.stdout.write('   - Start Celery beat: celery -A core beat -l info')
        
        self.stdout.write('\n4. 🧪 Test the system:')
        self.stdout.write('   - Run: python manage.py test_notifications')
        self.stdout.write('   - Create a test contact via API')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Setup complete! Follow the instructions above to configure your notification system.'))
