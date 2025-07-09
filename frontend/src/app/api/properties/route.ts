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

import { put, del } from '@vercel/blob';

// Image validation constants (moved from property-images/route.ts)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024; // Convert MB to bytes
const ALLOWED_IMAGE_TYPES = process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = parseInt(process.env.MAX_FILES_PER_UPLOAD || '10'); // Max images per property

interface VercelBlobUploadResponse {
  url: string;
  pathname: string;
  contentType?: string;
  contentDisposition: string;
}


// Helper function to validate image files (moved from property-images/route.ts)
function validateImageFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File "${file.name}" size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`;
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `File "${file.name}" type ${file.type} not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}.`;
  }
  return null;
}

// Helper function to generate unique filename (moved from property-images/route.ts)
function generateUniqueFilename(originalName: string, userId?: number | string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const userPrefix = userId ? `user-${userId}/` : '';
  const extension = originalName.split('.').pop() || 'jpg'; // Fallback extension
  // Ensure path is safe and doesn't allow directory traversal
  const safeOriginalNameBase = originalName.substring(0, originalName.lastIndexOf('.')).replace(/[^a-zA-Z0-9-_]/g, '');
  return `property-images/${userPrefix}${timestamp}-${randomStr}-${safeOriginalNameBase}.${extension}`;
}


// Helper function to get realtor ID for a user
async function getRealtorIdForUser(userId: number, token: string): Promise<number | null> {
  try {
    console.log('Fetching realtor for user ID:', userId);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/realtors/?user_id=${userId}`, { // More direct query
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

    const realtorsResponse = await response.json();
    console.log('Realtors API raw response:', realtorsResponse);
    
    let realtorsArray;
    if (Array.isArray(realtorsResponse)) {
      realtorsArray = realtorsResponse;
    } else if (realtorsResponse.results && Array.isArray(realtorsResponse.results)) {
      realtorsArray = realtorsResponse.results;
    } else {
      console.error('Unexpected realtors response format:', realtorsResponse);
      return null;
    }
    
    // Assuming the API returns a list, and we expect one realtor for the user_id
    const userRealtor = realtorsArray.length > 0 ? realtorsArray[0] : null;
    console.log('Found realtor for user:', userRealtor);
    
    return userRealtor?.id || null;
  } catch (error) {
    console.error('Error fetching realtor ID:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const uploadedImageUrls: string[] = []; // Keep track of uploaded blob URLs for potential rollback

  try {
    console.log('=== Property Creation Request (Multipart) ===');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    console.log('Attempting to verify token with Django backend...');
    const authResponse = await fetch(`${backendUrl}/api/accounts/profile/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!authResponse.ok) {
      console.log('Token verification failed with status:', authResponse.status);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    const userData = await authResponse.json();
    const userId = userData.id;
    if (!userId) {
      console.log('User ID not found in token response');
      return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 });
    }
    console.log('Token verified successfully for user:', userData.username, 'ID:', userId);

    const realtorId = await getRealtorIdForUser(userId, token);
    if (!realtorId) {
      console.log('No realtor profile found for user:', userId);
      return NextResponse.json({ error: 'Realtor profile not found. Please contact support.' }, { status: 400 });
    }
    console.log('Realtor ID found:', realtorId);

    // Parse FormData
    const formData = await request.formData();
    const propertyDataString = formData.get('propertyData') as string | null;
    const imageFiles = formData.getAll('images') as File[];

    if (!propertyDataString) {
      return NextResponse.json({ error: 'Property data is missing.' }, { status: 400 });
    }

    let propertyDetails: Omit<PropertyData, 'images'>;
    try {
      propertyDetails = JSON.parse(propertyDataString);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid property data format.' }, { status: 400 });
    }

    console.log(`Received ${imageFiles.length} image(s) for upload.`);

    // Validate images
    if (imageFiles.length > MAX_FILES) {
      return NextResponse.json({ error: `Cannot upload more than ${MAX_FILES} images.` }, { status: 400 });
    }

    const imageValidationErrors: string[] = [];
    for (const file of imageFiles) {
      if (file.size === 0) continue; // Skip empty file objects if any
      const error = validateImageFile(file);
      if (error) {
        imageValidationErrors.push(error);
      }
    }

    if (imageValidationErrors.length > 0) {
      return NextResponse.json({ error: 'Image validation failed', details: imageValidationErrors }, { status: 400 });
    }

    // Upload images to Vercel Blob
    const processedImageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file.size === 0) continue;
      const uniqueFilename = generateUniqueFilename(file.name, userId);
      try {
        console.log(`Uploading ${file.name} as ${uniqueFilename} to Vercel Blob...`);
        const blob: VercelBlobUploadResponse = await put(uniqueFilename, file, {
          access: 'public',
          addRandomSuffix: false, // We handle uniqueness in generateUniqueFilename
        });
        processedImageUrls.push(blob.url);
        uploadedImageUrls.push(blob.url); // Add to rollback list
        console.log(`Successfully uploaded ${uniqueFilename}, URL: ${blob.url}`);
      } catch (uploadError: any) {
        console.error(`Failed to upload ${file.name}:`, uploadError);
        // Rollback already uploaded images for this request
        for (const urlToDelete of uploadedImageUrls) {
          try {
            await del(urlToDelete);
            console.log(`Rolled back (deleted) blob: ${urlToDelete}`);
          } catch (deleteError) {
            console.error(`Failed to delete blob ${urlToDelete} during rollback:`, deleteError);
          }
        }
        return NextResponse.json({ error: `Failed to upload image "${file.name}".`, details: uploadError.message }, { status: 500 });
      }
    }

    // Prepare listing data for Django
    const listingData = {
      realtor: realtorId,
      title: propertyDetails.title,
      description: propertyDetails.description || '',
      price: parseInt(propertyDetails.price),
      address: propertyDetails.address,
      city: propertyDetails.city,
      state: propertyDetails.state,
      zipcode: propertyDetails.zipcode || '',
      property_type: propertyDetails.propertyType || 'house',
      bedrooms: parseInt(propertyDetails.bedrooms),
      bathrooms: parseFloat(propertyDetails.bathrooms),
      sqft: parseInt(propertyDetails.sqft),
      lot_size: propertyDetails.lotSize ? parseFloat(propertyDetails.lotSize) : null,
      year_built: propertyDetails.yearBuilt ? parseInt(propertyDetails.yearBuilt) : null,
      features: propertyDetails.features || [], // Assuming features is part of PropertyData
      garage: 0, // Default or get from propertyDetails if available
      is_published: true, // Or get from propertyDetails
      // Map uploaded image URLs to Django photo fields
      ...(processedImageUrls[0] && { photo_main: processedImageUrls[0] }),
      ...(processedImageUrls[1] && { photo_1: processedImageUrls[1] }),
      ...(processedImageUrls[2] && { photo_2: processedImageUrls[2] }),
      ...(processedImageUrls[3] && { photo_3: processedImageUrls[3] }),
      ...(processedImageUrls[4] && { photo_4: processedImageUrls[4] }),
      ...(processedImageUrls[5] && { photo_5: processedImageUrls[5] }),
      ...(processedImageUrls[6] && { photo_6: processedImageUrls[6] }),
      // If you have more photo fields, add them similarly
    };

    console.log('Creating property in Django with data:', listingData);
    const createResponse = await fetch(`${backendUrl}/api/listings/create/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({error: "Django error response not JSON"}));
      console.error('Django create error:', errorData);
      // Rollback: Delete images from Vercel Blob
      console.log('Django creation failed. Rolling back Vercel Blob uploads...');
      for (const urlToDelete of uploadedImageUrls) {
        try {
          await del(urlToDelete);
          console.log(`Rolled back (deleted) blob: ${urlToDelete}`);
        } catch (deleteError) {
          console.error(`Failed to delete blob ${urlToDelete} during rollback:`, deleteError);
          // Log this error but don't override the primary error from Django
        }
      }
      return NextResponse.json({ error: 'Failed to create property listing in backend.', details: errorData }, { status: createResponse.status });
    }

    const createdProperty = await createResponse.json();
    console.log('Property created successfully in Django:', createdProperty);

    return NextResponse.json({ 
      success: true, 
      property: createdProperty,
      message: 'Property listing created successfully with images.'
    });

  } catch (error: any) {
    console.error('Error in POST /api/properties:', error);
    // General error, attempt rollback if any images were uploaded before the error occurred
    if (uploadedImageUrls.length > 0) {
        console.log('Error occurred after some images might have been uploaded. Rolling back...');
        for (const urlToDelete of uploadedImageUrls) {
            try {
                await del(urlToDelete);
                console.log(`Rolled back (deleted) blob due to error: ${urlToDelete}`);
            } catch (deleteError) {
                console.error(`Failed to delete blob ${urlToDelete} during error rollback:`, deleteError);
            }
        }
    }
    return NextResponse.json({ 
      error: 'Internal server error during property creation.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
