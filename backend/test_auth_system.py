#!/usr/bin/env python
"""
Test script to verify the new role-based authentication system
"""
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append('/c/Users/PC/Documents/XlideLand/backend')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from accounts.models import UserProfile
import requests
import json

API_BASE_URL = 'http://127.0.0.1:8000'

def test_authentication_system():
    print("🧪 Testing New Role-Based Authentication System\n")
    
    # Test 1: Register a new buyer
    print("1️⃣ Testing buyer registration...")
    try:
        buyer_data = {
            "username": "testbuyer",
            "email": "buyer@test.com",
            "first_name": "Test",
            "last_name": "Buyer",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "role": "buyer"
        }
        
        response = requests.post(f"{API_BASE_URL}/api/accounts/register/", 
                               json=buyer_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 201:
            print("✅ Buyer registration successful!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Buyer registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Buyer registration error: {e}")
    
    # Test 2: Register a new seller
    print("\n2️⃣ Testing seller registration...")
    try:
        seller_data = {
            "username": "testseller",
            "email": "seller@test.com",
            "first_name": "Test",
            "last_name": "Seller",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "role": "seller"
        }
        
        response = requests.post(f"{API_BASE_URL}/api/accounts/register/", 
                               json=seller_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 201:
            print("✅ Seller registration successful!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Seller registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Seller registration error: {e}")
    
    # Test 3: Try to register admin (should fail for non-admin)
    print("\n3️⃣ Testing admin registration (should fail)...")
    try:
        admin_data = {
            "username": "testadmin",
            "email": "admin@test.com",
            "first_name": "Test",
            "last_name": "Admin",
            "password": "testpass123",
            "password_confirm": "testpass123",
            "role": "admin"
        }
        
        response = requests.post(f"{API_BASE_URL}/api/accounts/register/", 
                               json=admin_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 400:
            print("✅ Admin registration correctly blocked for non-admin!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Admin registration should have failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Admin registration test error: {e}")
    
    # Test 4: Login with admin and test profile endpoint
    print("\n4️⃣ Testing admin login and profile fetching...")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        response = requests.post(f"{API_BASE_URL}/api/accounts/login/", 
                               json=login_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            token = response.json()['access']
            print("✅ Admin login successful!")
            
            # Test profile endpoint
            headers = {'Authorization': f'Bearer {token}'}
            profile_response = requests.get(f"{API_BASE_URL}/api/accounts/profiles/", 
                                          headers=headers)
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                print("✅ Profile fetch successful!")
                print(f"   Profile data: {profile_data}")
                
                # Check if it's an array or direct object
                if isinstance(profile_data, list) and len(profile_data) > 0:
                    role = profile_data[0].get('role', 'Unknown')
                elif isinstance(profile_data, dict):
                    role = profile_data.get('role', 'Unknown')
                else:
                    role = 'Unknown'
                
                print(f"   Detected role: {role}")
            else:
                print(f"❌ Profile fetch failed: {profile_response.status_code}")
                print(f"   Error: {profile_response.text}")
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Admin login test error: {e}")
    
    # Test 5: Check database state
    print("\n5️⃣ Checking database state...")
    try:
        users = User.objects.all()
        profiles = UserProfile.objects.all()
        
        print(f"📊 Database Statistics:")
        print(f"   Total users: {users.count()}")
        print(f"   Total profiles: {profiles.count()}")
        print(f"   Users with profiles:")
        
        for user in users:
            try:
                profile = UserProfile.objects.get(user=user)
                print(f"     {user.username}: {profile.role}")
            except UserProfile.DoesNotExist:
                print(f"     {user.username}: No profile")
                
    except Exception as e:
        print(f"❌ Database check error: {e}")
    
    print("\n🎉 Authentication system test completed!")

if __name__ == "__main__":
    test_authentication_system()
