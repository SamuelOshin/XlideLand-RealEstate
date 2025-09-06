# 🔐 Google OAuth2 Setup Guide for XlideLand

## 📋 **Overview**

This guide walks you through setting up Google OAuth2 authentication for the XlideLand real estate platform. Users will be able to sign in and register using their Google accounts.

## 🚀 **Prerequisites**

- Google Cloud Console account
- Domain name (for production)
- XlideLand application running locally or deployed

## 📝 **Step 1: Google Cloud Console Setup**

### 1.1 Create a New Project (or use existing)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "XlideLand OAuth2")
4. Click "Create"

### 1.2 Enable Google+ API

1. Go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on "Google+ API" and click "Enable"
4. Also enable "Google People API" for profile information

### 1.3 Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" for user type
3. Fill in the required information:
   - **App name**: XlideLand Real Estate
   - **User support email**: your-email@example.com
   - **App logo**: Upload XlideLand logo (optional)
   - **App domain**: your-domain.com
   - **Developer contact**: your-email@example.com

4. **Scopes**: Add the following scopes:
   - `email`
   - `profile`
   - `openid`

5. **Test users** (for development): Add your test email addresses

### 1.4 Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "XlideLand Web Client"
5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

7. Click "Create"
8. **Save the Client ID and Client Secret** - you'll need these!

## ⚙️ **Step 2: Environment Variables Setup**

### 2.1 Frontend Environment Variables

Create or update `frontend/.env.local`:

```bash
# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-secure-random-secret-key

# Google OAuth2 credentials
GOOGLE_CLIENT_ID=your-google-client-id-from-step-1.4
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-1.4

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Production Example:**
```bash
NEXTAUTH_URL=https://xlideland.com
NEXTAUTH_SECRET=super-secure-production-secret-256-bits
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here
NEXT_PUBLIC_API_URL=https://api.xlideland.com
NEXT_PUBLIC_BACKEND_URL=https://api.xlideland.com
```

### 2.2 Backend Environment Variables

Update `backend/.env`:

```bash
# Google OAuth2 Settings
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id-from-step-1.4
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret-from-step-1.4
GOOGLE_OAUTH2_REDIRECT_URI=http://localhost:8000/auth/google/callback/

# CORS Settings (add your frontend domain)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Production Example:**
```bash
GOOGLE_OAUTH2_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_OAUTH2_CLIENT_SECRET=GOCSPX-your-secret-here
GOOGLE_OAUTH2_REDIRECT_URI=https://api.xlideland.com/auth/google/callback/
CORS_ALLOWED_ORIGINS=https://xlideland.com,https://www.xlideland.com
```

## 🔒 **Step 3: Security Configuration**

### 3.1 NEXTAUTH_SECRET Generation

Generate a secure secret for NextAuth.js:

```bash
# Method 1: Using OpenSSL
openssl rand -base64 32

# Method 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

### 3.2 Production Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure NEXTAUTH_SECRET (32+ characters)
- [ ] Configure proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable Google OAuth consent screen verification
- [ ] Set up proper domain verification

## 🧪 **Step 4: Testing the Implementation**

### 4.1 Local Development Testing

1. Start the backend server:
   ```bash
   cd backend
   python manage.py runserver 8000
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to `http://localhost:3000/auth/login`
4. Click "Continue with Google"
5. Complete the OAuth flow
6. Verify user is created in Django admin

### 4.2 Testing Checklist

- [ ] Google sign-in button appears on login/register pages
- [ ] Google OAuth flow completes successfully
- [ ] User account is created/linked in Django backend
- [ ] JWT tokens are generated and stored
- [ ] User is redirected to dashboard
- [ ] User profile shows Google account information
- [ ] Link/unlink Google account functionality works

## 🚨 **Step 5: Troubleshooting**

### Common Issues and Solutions

#### Issue: "redirect_uri_mismatch"
**Solution**: Check that the redirect URI in Google Console matches exactly:
- Development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.com/api/auth/callback/google`

#### Issue: "Invalid Google token"
**Solution**: 
- Verify GOOGLE_CLIENT_ID matches in both frontend and backend
- Check that Google+ API is enabled
- Ensure tokens are being passed correctly

#### Issue: "CORS errors"
**Solution**: Update Django CORS settings:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-production-domain.com",
]
```

#### Issue: "User creation fails"
**Solution**: Check Django logs for database errors or validation issues

## 📊 **Step 6: Production Deployment**

### 6.1 Google Console Production Setup

1. Update OAuth consent screen for production
2. Add production domain to authorized origins
3. Add production redirect URI
4. Submit app for verification (if needed)

### 6.2 Environment Variables for Production

Ensure all environment variables are set in your production environment:

**Frontend (Vercel/Netlify):**
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Backend (Railway/Heroku/VPS):**
- `GOOGLE_OAUTH2_CLIENT_ID`
- `GOOGLE_OAUTH2_CLIENT_SECRET`
- `CORS_ALLOWED_ORIGINS`

### 6.3 SSL Certificate

Ensure your production domain has a valid SSL certificate. Google OAuth2 requires HTTPS in production.

## ✅ **Step 7: Verification**

### Production Readiness Checklist

- [ ] Google Cloud Console properly configured
- [ ] OAuth consent screen approved (if applicable)
- [ ] Environment variables set correctly
- [ ] HTTPS enabled in production
- [ ] CORS configured for production domains
- [ ] Error handling tested
- [ ] User flow end-to-end tested
- [ ] Database migrations applied
- [ ] Backup authentication method available

## 📞 **Support**

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check Django logs for backend errors
3. Verify all environment variables are set
4. Test with a fresh incognito/private browser window
5. Review Google Cloud Console audit logs

## 🎉 **Success!**

Once completed, users will be able to:
- Sign in with Google on the login page
- Register new accounts using Google
- Link Google accounts to existing XlideLand accounts
- Manage their Google account connection in profile settings

Your XlideLand application now has enterprise-grade Google OAuth2 authentication! 🚀