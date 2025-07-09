from django.core.management.base import BaseCommand
from django.db import connection
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = 'Show database statistics for monitoring free tier usage'

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('📊 Database Statistics Report')
        )
        self.stdout.write('=' * 50)
        
        # Database size (PostgreSQL specific)
        if 'postgresql' in connection.settings_dict['ENGINE']:
            try:
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT pg_size_pretty(pg_database_size(current_database()))
                    """)
                    db_size = cursor.fetchone()[0]
                    self.stdout.write(f"💾 Database Size: {db_size}")
            except Exception as e:
                self.stdout.write(f"⚠️  Could not get database size: {e}")
        
        # Count records in key tables
        try:
            stats = {
                'Users': User.objects.count(),
                'Active Sessions': Session.objects.filter(
                    expire_date__gte=timezone.now()
                ).count(),
                'Expired Sessions': Session.objects.filter(
                    expire_date__lt=timezone.now()
                ).count(),
                'Outstanding Tokens': OutstandingToken.objects.count(),
                'Blacklisted Tokens': BlacklistedToken.objects.count(),
            }
            
            self.stdout.write("\n📈 Table Statistics:")
            for table, count in stats.items():
                if 'Expired' in table and count > 0:
                    self.stdout.write(f"  ⚠️  {table}: {count}")
                else:
                    self.stdout.write(f"  ✅ {table}: {count}")
            
            # Calculate expired tokens that can be cleaned
            cutoff_time = timezone.now() - timezone.timedelta(days=1)
            expired_outstanding_tokens = OutstandingToken.objects.filter(
                expires_at__lt=cutoff_time
            )
            expired_blacklisted = BlacklistedToken.objects.filter(
                token__in=expired_outstanding_tokens
            ).count()
            
            if expired_blacklisted > 0:
                self.stdout.write(
                    f"\n🧹 Cleanup Opportunities:"
                )
                self.stdout.write(
                    f"  • {expired_blacklisted} expired blacklisted tokens can be cleaned"
                )
                self.stdout.write(
                    f"  • Run: python manage.py clean_expired_tokens"
                )
                
            expired_sessions = Session.objects.filter(
                expire_date__lt=timezone.now()
            ).count()
            
            if expired_sessions > 0:
                self.stdout.write(
                    f"  • {expired_sessions} expired sessions can be cleaned"
                )
                self.stdout.write(
                    f"  • Run: python manage.py clearsessions"
                )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Error collecting statistics: {e}")
            )
        
        # Connection info
        self.stdout.write(f"\n🔗 Database Connection:")
        self.stdout.write(f"  • Engine: {connection.settings_dict['ENGINE']}")
        self.stdout.write(f"  • Host: {connection.settings_dict.get('HOST', 'N/A')}")
        self.stdout.write(f"  • Database: {connection.settings_dict.get('NAME', 'N/A')}")
        
        self.stdout.write('=' * 50)
