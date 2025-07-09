# Database Configuration Guide

## Overview
The XlideLand backend uses environment-based database configuration to seamlessly switch between SQLite (development) and PostgreSQL (production).

## Configuration

### Local Development (SQLite)
For local development, simply don't set the `DATABASE_URL` environment variable or leave it empty. The application will automatically use SQLite.

**Setup:**
1. Create a `.env` file in the backend directory (copy from `.env.example`)
2. Leave `DATABASE_URL` empty or don't include it
3. Run migrations: `python manage.py migrate`

### Production (PostgreSQL)
For production with your Neon PostgreSQL database, set the `DATABASE_URL` environment variable.

**Setup:**
1. Set the environment variable:
   ```bash
   DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>?sslmode=require
   ```

2. Run migrations:
   ```bash
   python manage.py migrate
   ```

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string for production (leave empty for SQLite)

### Optional
- `SECRET_KEY`: Django secret key
- `DEBUG`: Enable/disable debug mode
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

## Database URLs Format

The `DATABASE_URL` follows this format:
```
postgres://username:password@host:port/database_name?sslmode=require
```


For your Neon database (example):
- Username: `<username>`
- Password: `<password>`
- Host: `<host>`
- Database: `<database>`
- SSL Mode: `require`

## Migration Commands

### Local Development
```bash
# Create and apply migrations
python manage.py makemigrations
python manage.py migrate
```

### Production
```bash

# Set environment variable first (replace with your actual credentials)
export DATABASE_URL="postgres://<username>:<password>@<host>/<database>?sslmode=require"

# Apply migrations
python manage.py migrate
```

## Dependencies

The following packages are required:
- `dj-database-url`: For parsing database URLs
- `psycopg2-binary`: PostgreSQL adapter for Python

Both are included in `requirements.txt`.

## Security Notes

1. **Never commit sensitive data**: Keep your `.env` file in `.gitignore`
2. **Use environment variables**: In production, set `DATABASE_URL` as an environment variable
3. **SSL requirement**: The `?sslmode=require` ensures encrypted connections
4. **Rotate credentials**: Change database passwords regularly

## Troubleshooting

### Common Issues

1. **Connection refused**: Check if PostgreSQL service is running
2. **Authentication failed**: Verify username and password
3. **SSL errors**: Ensure `sslmode=require` is included in the URL
4. **Import errors**: Install required packages with `pip install -r requirements.txt`

### Testing Connection

To test your database connection:
```python
# In Django shell (python manage.py shell)
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT 1")
print("Database connection successful!")
```

## Best Practices

1. **Use migrations**: Always use Django migrations for schema changes
2. **Backup data**: Regular backups, especially before major changes
3. **Monitor connections**: Keep an eye on connection pool usage
4. **Environment parity**: Keep development and production environments as similar as possible
5. **Connection pooling**: The `conn_max_age=600` setting enables connection reuse
