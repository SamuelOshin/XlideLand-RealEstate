#!/usr/bin/env python
"""
Test script to verify maintenance commands work correctly
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


def test_maintenance_commands():
    """Test all maintenance commands"""
    print("🧪 Testing Maintenance Commands")
    print("=" * 40)
    
    # Test 1: Database stats
    print("\n1. Testing db_stats command...")
    try:
        call_command('db_stats')
        print("✅ db_stats command works")
    except Exception as e:
        print(f"❌ db_stats failed: {e}")
    
    # Test 2: Clean expired tokens (dry run)
    print("\n2. Testing clean_expired_tokens command (dry run)...")
    try:
        call_command('clean_expired_tokens', '--dry-run')
        print("✅ clean_expired_tokens command works")
    except Exception as e:
        print(f"❌ clean_expired_tokens failed: {e}")
    
    # Test 3: Clear sessions (Django built-in)
    print("\n3. Testing clearsessions command...")
    try:
        call_command('clearsessions')
        print("✅ clearsessions command works")
    except Exception as e:
        print(f"❌ clearsessions failed: {e}")
    
    # Test 4: Database connection
    print("\n4. Testing database connection...")
    try:
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        if result:
            print("✅ Database connection works")
        else:
            print("❌ Database connection failed")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
    
    print("\n" + "=" * 40)
    print("✅ Maintenance system test completed!")


if __name__ == '__main__':
    test_maintenance_commands()
