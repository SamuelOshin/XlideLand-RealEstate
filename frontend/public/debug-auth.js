// Simple test to check authentication state
console.log('=== Authentication Debug ===');

// Check localStorage
const accessToken = localStorage.getItem('access_token');
const refreshToken = localStorage.getItem('refresh_token');

console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'Not found');
console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Not found');

// Test token with backend
if (accessToken) {
  fetch('http://localhost:8000/api/accounts/profile/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Token validation response:', response.status);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  })
  .then(data => {
    console.log('✅ Token is valid! User:', data.username);
  })
  .catch(error => {
    console.log('❌ Token validation failed:', error.message);
  });
} else {
  console.log('❌ No access token found');
}

// Check if user is on the correct domain
console.log('Current URL:', window.location.href);
console.log('Local storage keys:', Object.keys(localStorage));
