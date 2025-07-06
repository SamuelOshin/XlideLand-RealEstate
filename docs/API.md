# API Documentation

## Overview
This document describes the REST API endpoints for the XlideLand Real Estate application.

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://api.xlideland.com`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication.

### Endpoints

#### Authentication
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/refresh/` - Refresh JWT token
- `POST /auth/logout/` - User logout

#### Listings
- `GET /listings/` - Get all listings
- `POST /listings/` - Create a new listing (admin only)
- `GET /listings/{id}/` - Get listing details
- `PUT /listings/{id}/` - Update listing (admin only)
- `DELETE /listings/{id}/` - Delete listing (admin only)
- `GET /listings/search/` - Search listings

#### Realtors
- `GET /realtors/` - Get all realtors
- `GET /realtors/{id}/` - Get realtor details

#### Contacts
- `POST /contacts/` - Submit contact form

## Response Format
All API responses follow this format:

`json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null
}
`
