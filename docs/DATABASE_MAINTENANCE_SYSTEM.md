# XlideLand Database Maintenance System

## Overview
A comprehensive maintenance system optimized for free tier Neon PostgreSQL database on Render deployment. This system automatically cleans up expired tokens and sessions to optimize database storage and performance.

## 🚀 What's Implemented

### 1. Custom Management Commands
- **`clean_expired_tokens`**: Removes expired JWT blacklisted tokens
- **`db_stats`**: Shows database statistics and cleanup opportunities

### 2. Main Maintenance Script
- **`maintenance.py`**: Orchestrates all maintenance tasks
- Supports `--stats`, `--clean`, and full maintenance modes

### 3. Database Optimizations
- **JWT Token Lifetimes**: Reduced from 60/7 days to 15min/3 days
- **Connection Pooling**: Optimized for free tier limits
- **Health Checks**: Enabled for better connection management

## 📋 Usage

### Manual Maintenance
```bash
# Full maintenance (recommended weekly)
python maintenance.py

# Statistics only
python maintenance.py --stats

# Cleanup only (recommended daily)
python maintenance.py --clean

# Individual commands
python manage.py clean_expired_tokens
python manage.py clean_expired_tokens --dry-run
python manage.py clearsessions
python manage.py db_stats
```

### Render Cron Job Setup

1. **Create a Cron Job Service** in your Render dashboard
2. **Connect to your repository**
3. **Set Build Command**: `pip install -r requirements.txt`
4. **Set Start Command**: `python maintenance.py --clean`
5. **Set Schedule**: `0 2 * * *` (Daily at 2 AM UTC)

### Environment Variables for Render Cron Job
```bash
DATABASE_URL=postgres://username:password@host/database?sslmode=require
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
```

## 🔧 Configuration Changes Made

### JWT Settings (settings.py)
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),  # Reduced from 60
    'REFRESH_TOKEN_LIFETIME': timedelta(days=3),     # Reduced from 7
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    # ... other settings
}
```

### Database Settings (settings.py)
```python
DATABASES = {
    'default': dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=300,  # Reduced from 600
        conn_health_checks=True,
    )
}
```

## 📊 What Gets Cleaned

### 1. Expired Blacklisted Tokens
- JWT tokens that have expired and are blacklisted
- Automatically removes both blacklisted and outstanding token records
- Prevents database bloat from old token records

### 2. Expired Sessions
- Django session records that have expired
- Uses Django's built-in `clearsessions` command
- Removes stale session data

## 🎯 Free Tier Benefits

### Storage Optimization
- **Prevents database bloat**: Regular cleanup of expired records
- **Reduces storage usage**: Keeps only necessary data
- **Improves performance**: Smaller tables = faster queries

### Connection Management
- **Shorter connection pooling**: Prevents connection exhaustion
- **Health checks**: Ensures connections are valid
- **Optimized settings**: Tuned for free tier limits

## 📈 Monitoring

### Database Statistics
The `db_stats` command provides:
- Database size (PostgreSQL only)
- Record counts for all major tables
- Cleanup opportunities
- Connection information

### Sample Output
```
📊 Database Statistics Report
==================================================
💾 Database Size: 9600 kB
📈 Table Statistics:
  ✅ Users: 5
  ✅ Active Sessions: 2
  ⚠️  Expired Sessions: 10
  ✅ Outstanding Tokens: 15
  ✅ Blacklisted Tokens: 3

🧹 Cleanup Opportunities:
  • 5 expired blacklisted tokens can be cleaned
  • Run: python manage.py clean_expired_tokens
  • 10 expired sessions can be cleaned
  • Run: python manage.py clearsessions
```

## 🛠️ Recommended Schedule

### Daily (Render Cron Job)
```bash
# Command: python maintenance.py --clean
# Schedule: 0 2 * * * (2 AM UTC daily)
```

### Weekly (Optional)
```bash
# Command: python maintenance.py
# Schedule: 0 3 * * 0 (3 AM UTC Sundays)
```

## 🧪 Testing

### Test Commands
```bash
# Test all maintenance commands
python test_maintenance.py

# Test database configuration
python test_db_config.py

# Test individual commands
python manage.py clean_expired_tokens --dry-run
python manage.py db_stats
```

## 🔒 Security Considerations

1. **Token Rotation**: Enabled to prevent token reuse
2. **Blacklisting**: Prevents compromised tokens from being reused
3. **Regular Cleanup**: Removes old tokens that could be compromised
4. **Connection Security**: SSL required for database connections

## 🚨 Troubleshooting

### Common Issues
1. **Command not found**: Ensure you're in the backend directory
2. **Django not configured**: Check DJANGO_SETTINGS_MODULE
3. **Database connection**: Verify DATABASE_URL is set correctly
4. **Permission errors**: Ensure proper file permissions on scripts

### Debug Commands
```bash
# Check environment
python -c "import django; print(django.VERSION)"

# Test database connection
python test_db_config.py

# Test maintenance system
python test_maintenance.py
```

## 📝 Files Created

```
backend/
├── accounts/management/commands/
│   ├── clean_expired_tokens.py    # Token cleanup command
│   └── db_stats.py                # Database statistics command
├── maintenance.py                 # Main maintenance script
├── test_maintenance.py           # Test maintenance system
└── render_cron.md                # Render cron job configuration
```

## 🎉 Benefits Summary

- **Automated cleanup**: Prevents database bloat
- **Free tier optimized**: Maximizes storage efficiency
- **Render ready**: Easy cron job deployment
- **Comprehensive monitoring**: Full visibility into database health
- **Security focused**: Regular token rotation and cleanup
- **Production ready**: Robust error handling and logging

This maintenance system ensures your free tier Neon PostgreSQL database stays optimized and performs well in production on Render.
