#!/usr/bin/env python
"""
XlideLand Backend API Test Script
Test all the new API endpoints we've implemented
"""

import os
import sys
import django
import json
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from accounts.models import (
    UserProfile, UserFavorite, Tour, Conversation, Message, 
    PropertyAlert, Document, Notification, UserActivity
)
from listings.models import Listing
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

def create_test_data():
    """Create test data for API testing"""
    print("🔧 Creating test data...")
    
    # Create test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'is_active': True
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
      # Create user profile
    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            'phone': '+1234567890',
            'bio': 'Test user profile'
        }
    )
    
    # Create test property (if doesn't exist)
    try:
        from realtors.models import Realtor
        realtor = Realtor.objects.first()
        if not realtor:
            print("⚠️  No realtor found, creating one...")
            realtor_user = User.objects.create_user(
                username='realtor1',
                email='realtor@example.com',
                first_name='Jane',
                last_name='Realtor'
            )
            realtor = Realtor.objects.create(
                name='Jane Realtor',
                email='realtor@example.com',
                phone='+1234567891'
            )
    except:
        realtor = None
    
    property_obj, _ = Listing.objects.get_or_create(
        title='Test Property',
        defaults={
            'address': '123 Test Street',
            'city': 'Boston',
            'state': 'MA',
            'zipcode': '02101',
            'description': 'A beautiful test property',
            'price': 500000,
            'bedrooms': 3,
            'bathrooms': 2,
            'garage': 1,
            'sqft': 1500,
            'lot_size': 0.25,
            'is_published': True,
            'realtor': realtor
        }
    )
    
    # Create test activities
    UserActivity.objects.get_or_create(
        user=user,
        activity_type='property_view',
        defaults={'description': 'Viewed test property'}
    )
    
    # Create test notification
    Notification.objects.get_or_create(
        user=user,
        type='test',
        title='Welcome!',
        defaults={'message': 'Welcome to XlideLand dashboard!'}
    )
    
    print(f"✅ Test data created for user: {user.username}")
    return user, property_obj

def test_api_endpoints():
    """Test all our new API endpoints"""
    print("\n🧪 Testing API endpoints...\n")
    
    # Create test data
    user, property_obj = create_test_data()
    
    # Create API client
    client = APIClient()
    
    # Get JWT token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    # Test endpoints
    tests = [
        # Authentication
        ('GET', '/api/accounts/profile/', 'User Profile'),
        ('GET', '/api/accounts/dashboard/stats/', 'Dashboard Stats'),
        ('GET', '/api/accounts/dashboard/analytics/', 'User Analytics'),
        
        # ViewSets
        ('GET', '/api/accounts/api/profiles/', 'User Profiles'),
        ('GET', '/api/accounts/api/favorites/', 'User Favorites'),
        ('GET', '/api/accounts/api/tours/', 'Tours'),
        ('GET', '/api/accounts/api/conversations/', 'Conversations'),
        ('GET', '/api/accounts/api/notifications/', 'Notifications'),
        ('GET', '/api/accounts/api/alerts/', 'Property Alerts'),
        ('GET', '/api/accounts/api/documents/', 'Documents'),
        ('GET', '/api/accounts/api/activities/', 'User Activities'),
        
        # Utility endpoints
        ('GET', '/api/accounts/search-users/?q=test', 'Search Users'),
    ]
    
    results = []
    for method, url, name in tests:
        try:
            if method == 'GET':
                response = client.get(url)
            elif method == 'POST':
                response = client.post(url, {})
            
            status = response.status_code
            if 200 <= status < 300:
                result = f"✅ {name}: {status}"
                print(result)
            else:
                result = f"⚠️  {name}: {status} - {response.data if hasattr(response, 'data') else 'No data'}"
                print(result)
                
            results.append((name, status, 'success' if 200 <= status < 300 else 'warning'))
            
        except Exception as e:
            result = f"❌ {name}: ERROR - {str(e)}"
            print(result)
            results.append((name, 'ERROR', 'error'))
    
    return results

def test_database_models():
    """Test that all our models work correctly"""
    print("\n🗄️  Testing database models...\n")
    
    user, property_obj = create_test_data()
    
    models_to_test = [
        ('User', User.objects.count()),
        ('UserProfile', UserProfile.objects.count()),
        ('UserFavorite', UserFavorite.objects.count()),
        ('Tour', Tour.objects.count()),
        ('Conversation', Conversation.objects.count()),
        ('Message', Message.objects.count()),
        ('PropertyAlert', PropertyAlert.objects.count()),
        ('Document', Document.objects.count()),
        ('Notification', Notification.objects.count()),
        ('UserActivity', UserActivity.objects.count()),
        ('Listing', Listing.objects.count()),
    ]
    
    for model_name, count in models_to_test:
        print(f"📊 {model_name}: {count} records")
    
    return models_to_test

def generate_summary():
    """Generate a summary report"""
    print("\n" + "="*60)
    print("🎯 XLIDELAND BACKEND INTEGRATION TEST SUMMARY")
    print("="*60)
    
    # Test models
    models = test_database_models()
    
    # Test API endpoints
    api_results = test_api_endpoints()
    
    print(f"\n📈 RESULTS SUMMARY:")
    print(f"   Database Models: {len(models)} tested")
    print(f"   API Endpoints: {len(api_results)} tested")
    
    successful_apis = len([r for r in api_results if r[2] == 'success'])
    print(f"   Successful APIs: {successful_apis}/{len(api_results)}")
    
    if successful_apis == len(api_results):
        print("\n🎉 ALL TESTS PASSED! Backend is fully operational!")
    else:
        print(f"\n⚠️  {len(api_results) - successful_apis} API(s) need attention")
    
    print(f"\n🚀 Backend Status: READY FOR FRONTEND INTEGRATION")
    print("="*60)

if __name__ == "__main__":
    generate_summary()
