#!/usr/bin/env python
"""
Test script to verify database configuration
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

def test_database_connection():
    """Test database connection and configuration"""
    from django.db import connection
    from django.conf import settings
    
    try:
        # Test connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        
        # Get database info
        db_config = settings.DATABASES['default']
        
        print("✅ Database Connection Test Results:")
        print(f"   Engine: {db_config.get('ENGINE', 'Unknown')}")
        print(f"   Name/Database: {db_config.get('NAME', 'Unknown')}")
        print(f"   Connection: {'✅ Success' if result else '❌ Failed'}")
        
        # Check if using DATABASE_URL
        if os.getenv('DATABASE_URL'):
            print(f"   Mode: Production (PostgreSQL)")
            print(f"   Database URL: Set")
        else:
            print(f"   Mode: Development (SQLite)")
            print(f"   Database File: {db_config.get('NAME', 'Unknown')}")
            
    except Exception as e:
        print(f"❌ Database Connection Failed: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("Testing Database Configuration...")
    success = test_database_connection()
    sys.exit(0 if success else 1)
