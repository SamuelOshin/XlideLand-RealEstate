#!/usr/bin/env python
"""
Database maintenance script for free tier Neon PostgreSQL
Optimized for Render deployment with cron job support

Usage:
  python maintenance.py           # Run full maintenance
  python maintenance.py --stats   # Show stats only
  python maintenance.py --clean   # Clean only
"""
import os
import sys
import django
from pathlib import Path

# Add the backend directory to the path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.management import call_command


def run_maintenance(stats_only=False, clean_only=False):
    """Run database maintenance tasks"""
    print("🔧 XlideLand Database Maintenance")
    print("=" * 40)
    
    if clean_only or not stats_only:
        print("\n1. 🧹 Cleaning expired tokens...")
        try:
            call_command('clean_expired_tokens')
        except Exception as e:
            print(f"❌ Error cleaning tokens: {e}")
        
        print("\n2. 🗑️  Cleaning expired sessions...")
        try:
            call_command('clearsessions')
        except Exception as e:
            print(f"❌ Error cleaning sessions: {e}")
    
    if stats_only or not clean_only:
        print("\n3. 📊 Database statistics:")
        try:
            call_command('db_stats')
        except Exception as e:
            print(f"❌ Error getting stats: {e}")
    
    print("\n✅ Maintenance completed!")
    print("=" * 40)


def main():
    """Main function with argument parsing"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='XlideLand Database Maintenance Tool'
    )
    parser.add_argument(
        '--stats',
        action='store_true',
        help='Show database statistics only'
    )
    parser.add_argument(
        '--clean',
        action='store_true',
        help='Run cleanup tasks only'
    )
    
    args = parser.parse_args()
    
    # Validate environment
    try:
        from django.conf import settings
        if not settings.configured:
            print("❌ Django settings not configured properly")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Django setup error: {e}")
        sys.exit(1)
    
    # Run maintenance
    try:
        run_maintenance(stats_only=args.stats, clean_only=args.clean)
    except Exception as e:
        print(f"❌ Maintenance failed: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
