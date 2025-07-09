#!/bin/bash
set -e

echo "🚀 Starting XlideLand Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
python manage.py wait_for_db || echo "⚠️  Database wait command not found, continuing..."

# Run database migrations
echo "📊 Running database migrations..."
python manage.py migrate --noinput

# Create superuser if it doesn't exist (ONLY in development)
if [ "$DEBUG" = "True" ]; then
    echo "👤 Creating superuser for development..."
    python manage.py shell << EOF
from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@xlideland.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if password and not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"✅ Superuser '{username}' created successfully!")
elif not password:
    print("⚠️  DJANGO_SUPERUSER_PASSWORD not set, skipping superuser creation")
else:
    print("✅ Superuser already exists")
EOF
else
    echo "🔒 Production mode: Superuser creation skipped for security"
    echo "ℹ️  To create superuser in production, run: docker exec -it <container> python manage.py createsuperuser"
fi

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# Clean up expired tokens (if maintenance system is available)
echo "🧹 Cleaning up expired tokens..."
python manage.py clean_expired_tokens || echo "⚠️  Token cleanup command not found, skipping..."

echo "✅ Initialization complete!"

# Execute the main command
exec "$@"
