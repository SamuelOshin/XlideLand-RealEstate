# 🏠 XlideLand Real Estate Platform

A modern, full-stack real estate platform built with Django REST API backend and Next.js React frontend, featuring beautiful UI with Tailwind CSS and Shadcn UI components.

## 🌟 Features

### 🏡 Property Management
- **Property Listings**: Browse and search through extensive property database
- **Advanced Search**: Filter by location, price, property type, bedrooms, bathrooms
- **Property Details**: Comprehensive property information with image galleries
- **Featured Properties**: Highlight premium listings on homepage
- **Interactive Maps**: Location-based property exploration

### 👥 User Management
- **User Registration & Authentication**: Secure JWT-based authentication
- **User Dashboard**: Personalized user experience with saved favorites
- **Realtor Profiles**: Dedicated profiles for real estate agents
- **Contact System**: Direct communication between users and realtors

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with excellent mobile experience
- **Modern Components**: Built with Shadcn UI and Tailwind CSS
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Image Optimization**: Fast loading with Next.js image optimization
- **SEO Optimized**: Server-side rendering for better search engine visibility

### 🔧 Technical Features
- **REST API**: Well-documented API with Swagger/OpenAPI
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test coverage for both frontend and backend
- **Docker Support**: Easy deployment with Docker containers
- **CI/CD Pipeline**: Automated testing and deployment workflows

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **Git**

### Setup (Windows)
```powershell
# Clone the repository
git clone <repository-url>
cd XlideLand

# Run the setup script
.\scripts\setup.ps1

# Start development servers
.\scripts\start-dev.ps1
```

### Setup (Linux/macOS)
```bash
# Clone the repository
git clone <repository-url>
cd XlideLand

# Make setup script executable and run
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start backend
cd backend && source venv/bin/activate && python manage.py runserver

# In another terminal, start frontend
cd frontend && npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **API Documentation**: http://localhost:8000/api/docs

## 📁 Project Structure

```
XlideLand/
├── backend/                    # Django REST API
│   ├── accounts/              # User management
│   ├── listings/              # Property listings
│   ├── realtors/              # Realtor management
│   ├── contacts/              # Contact forms
│   ├── core/                  # Core settings
│   └── requirements/          # Dependencies
├── frontend/                  # Next.js React app
│   ├── src/
│   │   ├── app/               # Next.js 14 app router
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities
│   │   ├── services/          # API services
│   │   └── types/             # TypeScript types
│   └── public/                # Static assets
├── docs/                      # Documentation
├── scripts/                   # Setup and utility scripts
└── docker-compose.yml         # Docker configuration
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 4.2+ with Django REST Framework
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT tokens
- **API Documentation**: drf-spectacular (Swagger)
- **Testing**: pytest
- **Code Quality**: Black, Flake8, mypy

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier, pre-commit hooks
- **Deployment**: Ready for cloud deployment (Azure, AWS, etc.)

## 📖 Documentation

- **[Implementation Guide](IMPLEMENTATION_GUIDE.md)**: Complete migration strategy and implementation details
- **[Project Structure](docs/PROJECT_STRUCTURE.md)**: Detailed project organization and patterns
- **[Migration Plan](docs/MIGRATION_PLAN.md)**: Step-by-step migration from Django monolith
- **[API Documentation](docs/API.md)**: REST API endpoints and usage
- **[Development Guide](docs/DEVELOPMENT.md)**: Development setup and workflow

## 🧪 Testing

### Backend Testing
```bash
cd backend
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\Activate      # Windows

pytest
pytest --cov  # With coverage
```

### Frontend Testing
```bash
cd frontend
npm test                    # Unit tests
npm run test:e2e           # E2E tests with Playwright
```

## 🚀 Deployment

### Development
```bash
docker-compose up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the coding standards
4. **Write tests** for your changes
5. **Run tests** to ensure everything works
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Standards
- **Backend**: Follow PEP 8 and Django best practices
- **Frontend**: Follow ESLint and Prettier configurations
- **TypeScript**: Use strict type checking
- **Testing**: Maintain >80% test coverage
- **Documentation**: Update docs for any new features

### Development Workflow
1. **Backend First**: Implement API endpoints with tests
2. **Frontend Integration**: Connect frontend to new APIs
3. **Testing**: Write comprehensive tests
4. **Documentation**: Update relevant documentation
5. **Code Review**: Submit PR for review

## 📈 Performance

### Optimization Features
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: Redis caching for API responses
- **Database Optimization**: Proper indexing and query optimization
- **Bundle Analysis**: Webpack bundle analyzer for frontend optimization

### Performance Metrics
- **Lighthouse Score**: Target 90+ for all metrics
- **Core Web Vitals**: Excellent scores for user experience
- **API Response Time**: <200ms average response time
- **Bundle Size**: Optimized JavaScript bundles

## 🔒 Security

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Comprehensive input validation and sanitization
- **File Upload Security**: Secure file handling with type validation
- **SQL Injection Prevention**: ORM-based queries
- **XSS Protection**: React's built-in XSS protection

### Security Best Practices
- **Environment Variables**: Sensitive data in environment files
- **HTTPS**: SSL/TLS encryption for production
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Proper security headers configuration

## 📱 Mobile Support

- **Responsive Design**: Mobile-first approach
- **Touch Optimized**: Touch-friendly interface elements
- **Progressive Web App**: PWA capabilities for app-like experience
- **Offline Support**: Basic offline functionality
- **Performance**: Optimized for mobile networks

## 🌍 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Graceful Degradation**: Fallbacks for older browsers

## 📞 Support

For support and questions:
- **Documentation**: Check the docs/ directory
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for general questions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Django**: Amazing web framework
- **Next.js**: Excellent React framework
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Beautiful component library
- **Vercel**: Excellent hosting platform
- **Open Source Community**: For all the amazing tools and libraries

---

**Built with ❤️ for the real estate industry**

**Happy coding! 🚀**
