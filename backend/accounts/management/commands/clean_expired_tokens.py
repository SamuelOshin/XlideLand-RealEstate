from django.core.management.base import BaseCommand
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.utils import timezone
from django.db.models import Count


class Command(BaseCommand):
    help = 'Clean expired blacklisted tokens to optimize database storage'

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=1,
            help='Delete tokens expired more than N days ago (default: 1)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting'
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        cutoff_time = timezone.now() - timezone.timedelta(days=days)
        
        # Find expired outstanding tokens
        expired_outstanding_tokens = OutstandingToken.objects.filter(
            expires_at__lt=cutoff_time
        )
        
        # Find blacklisted tokens that reference expired outstanding tokens
        expired_blacklisted_tokens = BlacklistedToken.objects.filter(
            token__in=expired_outstanding_tokens
        )
        
        count = expired_blacklisted_tokens.count()
        
        if count == 0:
            self.stdout.write(
                self.style.SUCCESS('No expired blacklisted tokens to clean')
            )
            return
        
        # Show what will be deleted
        self.stdout.write(
            f'Found {count} expired blacklisted tokens older than {days} day(s)'
        )
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(f'DRY RUN: Would delete {count} expired blacklisted tokens')
            )
            return
        
        # Delete expired blacklisted tokens
        deleted_count = expired_blacklisted_tokens.delete()[0]
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully deleted {deleted_count} expired blacklisted tokens')
        )
        
        # Clean up orphaned outstanding tokens
        orphaned_outstanding = OutstandingToken.objects.filter(
            expires_at__lt=cutoff_time,
            blacklistedtoken__isnull=True
        )
        
        orphaned_count = orphaned_outstanding.count()
        if orphaned_count > 0:
            orphaned_deleted = orphaned_outstanding.delete()[0]
            self.stdout.write(
                self.style.SUCCESS(f'Also cleaned {orphaned_deleted} orphaned outstanding tokens')
            )
        
        # Show remaining tokens
        remaining_blacklisted = BlacklistedToken.objects.count()
        remaining_outstanding = OutstandingToken.objects.count()
        
        self.stdout.write(
            f'Remaining blacklisted tokens: {remaining_blacklisted}'
        )
        self.stdout.write(
            f'Remaining outstanding tokens: {remaining_outstanding}'
        )
