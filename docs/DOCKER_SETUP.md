# XlideLand Backend Docker Setup

## 🐳 Docker Configuration

This directory contains a complete Docker setup for the XlideLand Django backend, optimized for both development and production environments.

## 📁 Files Created

```
backend/
├── Dockerfile                 # Main Docker image definition
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
├── entrypoint.sh              # Container initialization script
├── .dockerignore              # Files to exclude from Docker build
└── core/health.py             # Health check endpoint
```

## 🚀 Quick Start

### Development with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Using production compose file
docker-compose -f docker-compose.prod.yml up -d --build

# With environment file
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

### Single Container (Backend Only)

```bash
# Build the image
docker build -t xlideland-backend .

# Run with SQLite (development)
docker run -p 8000:8000 \
  -e DEBUG=True \
  -e SECRET_KEY=your-secret-key \
  -e ALLOWED_HOSTS=localhost,127.0.0.1 \
  xlideland-backend

# Run with PostgreSQL (production)
docker run -p 8000:8000 \
  -e DEBUG=False \
  -e SECRET_KEY=your-secret-key \
  -e ALLOWED_HOSTS=your-domain.com \
  -e DATABASE_URL=postgres://user:pass@host:5432/dbname \
  xlideland-backend
```

## 🔧 Configuration

### Environment Variables

#### Required
- `SECRET_KEY`: Django secret key
- `DATABASE_URL`: PostgreSQL connection string (optional for SQLite)

#### Optional
- `DEBUG`: Enable/disable debug mode (default: False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of CORS origins

#### Example .env file
```bash
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgres://user:password@host:5432/database
```

### Docker Compose Environments

#### Development (docker-compose.yml)
- Includes PostgreSQL database
- Debug mode enabled
- Auto-reload on code changes
- Local volumes for media and logs

#### Production (docker-compose.prod.yml)
- Optimized for production
- Resource limits
- Optional Nginx reverse proxy
- Health checks enabled

## 🏗️ Build Features

### Multi-stage Build
- Uses Python 3.11 slim for smaller image size
- Installs only necessary system dependencies
- Removes build tools after installation

### Security
- Runs as non-root user (django)
- Proper file permissions
- Environment variable validation

### Health Checks
- Built-in health check endpoint: `/api/health/`
- Database connection verification
- Container health monitoring

### Initialization
- Automatic database migrations
- Static file collection
- Superuser creation (admin/admin123)
- Expired token cleanup

## 📊 Monitoring

### Health Check Endpoint
```bash
# Check container health
curl http://localhost:8000/api/health/

# Response
{
  "status": "healthy",
  "database": "connected",
  "service": "xlideland-backend"
}
```

### Container Logs
```bash
# View live logs
docker-compose logs -f backend

# View specific service logs
docker logs <container_id>
```

### Resource Usage
```bash
# View container stats
docker stats

# View specific container
docker stats xlideland-backend
```

## 🛠️ Development Workflow

### Local Development with Docker
1. Clone the repository
2. Set up environment variables
3. Run `docker-compose up --build`
4. Access the API at `http://localhost:8000`

### Making Changes
```bash
# Rebuild after code changes
docker-compose up --build

# Or rebuild specific service
docker-compose build backend
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell

# Run maintenance
docker-compose exec backend python maintenance.py
```

## 🚀 Production Deployment

### Render Deployment
1. Connect your repository to Render
2. Create a Web Service
3. Set build command: `docker build -t xlideland-backend .`
4. Set start command: `docker run -p 8000:8000 xlideland-backend`
5. Configure environment variables

### AWS/GCP/Azure
1. Build and push to container registry
2. Deploy using container service
3. Configure load balancer and health checks
4. Set up environment variables

### Manual Server Deployment
```bash
# Pull the latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run maintenance
docker-compose -f docker-compose.prod.yml exec backend python maintenance.py
```

## 🔍 Troubleshooting

### Common Issues

#### Container won't start
```bash
# Check logs
docker-compose logs backend

# Check container status
docker ps -a
```

#### Database connection issues
```bash
# Test database connection
docker-compose exec backend python manage.py wait_for_db

# Check database logs
docker-compose logs db
```

#### Permission issues
```bash
# Fix permissions
docker-compose exec backend chmod -R 755 /app
```

#### Build issues
```bash
# Clean build (no cache)
docker-compose build --no-cache backend

# Remove all containers and volumes
docker-compose down -v
docker system prune -a
```

### Debug Mode
```bash
# Run with debug shell
docker-compose exec backend python manage.py shell

# Run specific management command
docker-compose exec backend python manage.py <command>

# Access container shell
docker-compose exec backend bash
```

## 📈 Performance Optimization

### Production Settings
- Gunicorn with 3 workers
- Connection pooling enabled
- Static file serving optimized
- Health check intervals optimized

### Scaling
```bash
# Scale backend service
docker-compose up --scale backend=3

# With load balancer (nginx)
docker-compose -f docker-compose.prod.yml up --scale backend=3
```

## 🔒 Security Considerations

1. **Non-root user**: Container runs as `django` user
2. **Environment variables**: Sensitive data not in image
3. **Health checks**: Monitor container health
4. **Resource limits**: Prevent resource exhaustion
5. **Network security**: Only expose necessary ports

## 📝 Next Steps

1. **CI/CD Pipeline**: Set up automated builds and deployments
2. **Monitoring**: Add application monitoring (e.g., Sentry)
3. **Backup**: Configure database backup strategy
4. **SSL/TLS**: Set up HTTPS with reverse proxy
5. **Caching**: Add Redis for caching and sessions

This Docker setup provides a robust foundation for deploying your XlideLand backend in any environment!
