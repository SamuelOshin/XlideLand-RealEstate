# Render Cron Job Configuration
# 
# To use this with Render:
# 1. Create a new Cron Job service in your Render dashboard
# 2. Connect it to your repository
# 3. Set the build command: pip install -r requirements.txt
# 4. Set the start command: python maintenance.py --clean
# 5. Set the schedule (examples below)

# RECOMMENDED SCHEDULES:

# Daily cleanup at 2 AM UTC (most efficient for free tier)
# Cron expression: 0 2 * * *
# Command: python maintenance.py --clean

# Weekly stats and cleanup every Sunday at 3 AM UTC
# Cron expression: 0 3 * * 0
# Command: python maintenance.py

# ENVIRONMENT VARIABLES FOR RENDER CRON JOB:
# Set these in your Render cron job environment:
# - DATABASE_URL: Your Neon PostgreSQL connection string
# - SECRET_KEY: Your Django secret key
# - DEBUG: False
# - ALLOWED_HOSTS: your-domain.com

# COMMANDS AVAILABLE:
# python maintenance.py           # Full maintenance (clean + stats)
# python maintenance.py --clean   # Cleanup only (recommended for daily)
# python maintenance.py --stats   # Statistics only

# INDIVIDUAL DJANGO COMMANDS:
# python manage.py clean_expired_tokens
# python manage.py clearsessions
# python manage.py db_stats
