#!/usr/bin/env python3
"""
Quick test script to verify the authentication endpoint
"""

import requests
import json

# Test configuration
BACKEND_URL = "http://127.0.0.1:8000"
TEST_CREDENTIALS = {
    "email": "admin@xlideland.com",  # Using actual email from database
    "password": "admin123"  # You may need to adjust this password
}

def test_login_endpoint():
    """Test the login endpoint with email credentials"""
    url = f"{BACKEND_URL}/api/accounts/login/"
    
    print("🔍 Testing Login Endpoint...")
    print(f"URL: {url}")
    print(f"Credentials: {TEST_CREDENTIALS}")
    print("-" * 50)
    
    try:
        response = requests.post(
            url, 
            data=json.dumps(TEST_CREDENTIALS),
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            data = response.json()
            print(f"Access Token: {data.get('access', 'N/A')[:50]}...")
            print(f"Refresh Token: {data.get('refresh', 'N/A')[:50]}...")
        elif response.status_code == 400:
            print("❌ 400 Bad Request - Check the error details above")
        elif response.status_code == 401:
            print("❌ 401 Unauthorized - Invalid credentials")
        elif response.status_code == 404:
            print("❌ 404 Not Found - Check if the endpoint exists")
        elif response.status_code == 500:
            print("❌ 500 Server Error - Check Django logs")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error - Is the Django server running on port 8000?")
    except requests.exceptions.Timeout:
        print("❌ Timeout Error - Server is not responding")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_server_health():
    """Test if the server is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/admin/", timeout=5)
        if response.status_code in [200, 302]:
            print("✅ Django server is running!")
            return True
        else:
            print(f"⚠️ Server responding but unexpected status: {response.status_code}")
            return False
    except:
        print("❌ Django server is not running or not accessible")
        return False

if __name__ == "__main__":
    print("🚀 XlideLand Authentication Test")
    print("=" * 50)
    
    # Test server health first
    if test_server_health():
        print()
        test_login_endpoint()
    
    print("\n" + "=" * 50)
    print("📝 Debugging Steps:")
    print("1. Ensure Django server is running: python manage.py runserver")
    print("2. Check if user exists: python manage.py shell")
    print("3. Verify CORS settings in settings.py")
    print("4. Check Django logs for detailed error messages")
    print("5. Verify the login endpoint URL: /api/accounts/login/")
