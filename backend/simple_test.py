import urllib.request
import urllib.parse
import json

def test_endpoint(url, data):
    print(f"\n🔍 Testing: {url}")
    print(f"Data: {data}")
    
    # Convert to JSON
    json_data = json.dumps(data).encode('utf-8')
    
    # Create request
    req = urllib.request.Request(
        url,
        data=json_data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        # Make request
        with urllib.request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print(f"✅ Status: {response.status}")
            print(f"Response: {result}")
            return True
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code}: {e.reason}")
        try:
            error_response = e.read().decode('utf-8')
            print(f"Error Response: {error_response}")
        except:
            print("Could not read error response")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

# Test data
test_data = {
    'email': 'admin@xlideland.com',
    'password': 'admin123'
}

print("🚀 XlideLand Authentication Test")
print("=" * 50)

# Test our custom accounts endpoint
success1 = test_endpoint('http://127.0.0.1:8000/api/accounts/login/', test_data)

# Test the default JWT endpoint
success2 = test_endpoint('http://127.0.0.1:8000/api/auth/login/', test_data)

print("\n" + "=" * 50)
print("📋 Summary:")
print(f"Custom accounts/login/: {'✅ Success' if success1 else '❌ Failed'}")
print(f"Default auth/login/: {'✅ Success' if success2 else '❌ Failed'}")
