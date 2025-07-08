import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface FileMetadata {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface PropertyData {
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  features: string[];
  images: FileMetadata[];
}

// Helper function to get user ID from JWT token
function getUserIdFromToken(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.user_id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Helper function to get realtor ID for a user
async function getRealtorIdForUser(userId: number, token: string): Promise<number | null> {
  try {
    console.log('Fetching realtor for user ID:', userId);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/realtors/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Realtors API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch realtors:', errorText);
      return null;
    }

    const realtors = await response.json();
    console.log('Realtors API raw response:', realtors);
    console.log('Realtors type:', typeof realtors);
    console.log('Is array:', Array.isArray(realtors));
    
    // Handle different response formats
    let realtorsArray;
    if (Array.isArray(realtors)) {
      realtorsArray = realtors;
    } else if (realtors.results && Array.isArray(realtors.results)) {
      // Handle paginated response
      realtorsArray = realtors.results;
    } else {
      console.error('Unexpected realtors response format:', realtors);
      return null;
    }
    
    console.log('Realtors fetched:', realtorsArray.length, 'realtors');
    console.log('Looking for realtor with user ID:', userId);
    
    const userRealtor = realtorsArray.find((r: any) => r.user && r.user.id === userId);
    console.log('Found realtor for user:', userRealtor);
    
    return userRealtor?.id || null;
  } catch (error) {
    console.error('Error fetching realtor ID:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Property Creation Request ===');
    
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Token received (first 20 chars):', token.substring(0, 20) + '...');
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    // Verify token with Django backend by getting user profile
    console.log('Attempting to verify token with Django backend...');
    const authResponse = await fetch(`${backendUrl}/api/accounts/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!authResponse.ok) {
      console.log('Token verification failed with status:', authResponse.status);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userData = await authResponse.json();
    console.log('Token verified successfully for user:', userData.username);
    const userId = userData.id;

    if (!userId) {
      console.log('User ID not found in token response');
      return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 });
    }

    console.log('User ID found:', userId);

    // Get realtor ID for the user
    console.log('Getting realtor ID for user...');
    const realtorId = await getRealtorIdForUser(userId, token);
    console.log('Realtor ID result:', realtorId);
    
    if (!realtorId) {
      console.log('No realtor profile found for user:', userId);
      return NextResponse.json({ 
        error: 'Realtor profile not found. Please contact support to set up your realtor profile.' 
      }, { status: 400 });
    }

    console.log('Realtor ID found:', realtorId);

    // Parse request body
    const propertyData: PropertyData = await request.json();

    // Validate required fields
    if (!propertyData.title || !propertyData.price || !propertyData.address || 
        !propertyData.city || !propertyData.state || !propertyData.bedrooms || 
        !propertyData.bathrooms || !propertyData.sqft) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Prepare property data for Django
    const listingData = {
      realtor: realtorId,
      title: propertyData.title,
      description: propertyData.description || '',
      price: parseInt(propertyData.price),
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      zipcode: propertyData.zipcode || '',
      property_type: propertyData.propertyType || 'house',
      bedrooms: parseInt(propertyData.bedrooms),
      bathrooms: parseFloat(propertyData.bathrooms),
      sqft: parseInt(propertyData.sqft),
      lot_size: propertyData.lotSize ? parseFloat(propertyData.lotSize) : null,
      year_built: propertyData.yearBuilt ? parseInt(propertyData.yearBuilt) : null,
      garage: 0, // Default value
      is_published: true,
      // Map uploaded images to photo fields (only include if URL exists)
      ...(propertyData.images[0]?.url && { photo_main: propertyData.images[0].url }),
      ...(propertyData.images[1]?.url && { photo_1: propertyData.images[1].url }),
      ...(propertyData.images[2]?.url && { photo_2: propertyData.images[2].url }),
      ...(propertyData.images[3]?.url && { photo_3: propertyData.images[3].url }),
      ...(propertyData.images[4]?.url && { photo_4: propertyData.images[4].url }),
      ...(propertyData.images[5]?.url && { photo_5: propertyData.images[5].url }),
      ...(propertyData.images[6]?.url && { photo_6: propertyData.images[6].url }),
    };

    console.log('Creating property with data:', listingData);

    // Create property in Django backend
    const createResponse = await fetch(`${backendUrl}/api/listings/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Django create error:', errorData);
      return NextResponse.json({ 
        error: 'Failed to create property listing',
        details: errorData 
      }, { status: createResponse.status });
    }

    const createdProperty = await createResponse.json();
    console.log('Property created successfully:', createdProperty);

    return NextResponse.json({ 
      success: true, 
      property: createdProperty,
      message: 'Property listing created successfully'
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
