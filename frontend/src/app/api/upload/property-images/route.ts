import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// File validation utilities
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024; // Convert MB to bytes
const ALLOWED_IMAGE_TYPES = process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILES = parseInt(process.env.MAX_FILES_PER_UPLOAD || '10');

interface UploadResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Function to get user from token
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No authorization header or invalid format');
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    // Verify token with our Django backend
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/accounts/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('Token verification failed with status:', response.status);
      return null;
    }

    const user = await response.json();
    console.log('Token verified successfully for user:', user.username);
    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Utility function to validate image files
function validateImageFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `File type ${file.type} not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`;
  }

  return null;
}

// Utility function to generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop();
  return `property-images/${timestamp}-${randomStr}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to upload files' },
        { status: 401 }
      );
    }

    // Get the token for Django API calls
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing authentication token' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const propertyId = formData.get('property_id') as string;

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    // Validate each file
    const validationErrors: string[] = [];
    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        validationErrors.push(`${file.name}: ${error}`);
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'File validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Upload files to Vercel Blob
    const uploadedFiles: UploadResponse[] = [];
    
    const uploadPromises = files.map(async (file) => {
      try {
        const filename = generateUniqueFilename(file.name);
        const blob = await put(filename, file, {
          access: 'public',
          addRandomSuffix: false,
        });

        const uploadResponse: UploadResponse = {
          id: blob.pathname.split('/').pop() || '',
          name: file.name,
          size: file.size,
          type: file.type,
          url: blob.url,
          uploadedAt: new Date().toISOString(),
        };

        // Save file metadata to Django backend
        await saveFileMetadataToDjango(uploadResponse, propertyId, token || '');

        return uploadResponse;
      } catch (uploadError) {
        console.error('Upload error for file:', file.name, uploadError);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      uploadedFiles.push(...results);
    } catch (uploadError) {
      return NextResponse.json(
        { error: 'Some files failed to upload', details: uploadError },
        { status: 500 }
      );
    }

    // Return successful uploads
    return NextResponse.json({
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles,
    });

  } catch (error) {
    console.error('Property images upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to save file metadata to Django
async function saveFileMetadataToDjango(
  file: UploadResponse, 
  propertyId: string | null, 
  token: string
): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    const fullUrl = `${apiUrl}/api/accounts/files/store-metadata/`;
    
    console.log('Attempting to save metadata to:', fullUrl);
    console.log('Metadata payload:', {
      file_name: file.name,
      file_type: 'property-image',
      category: 'property'
    });
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        file_name: file.name,
        original_name: file.name,
        file_type: 'property-image',
        mime_type: file.type,
        file_size: file.size,
        blob_url: file.url,
        blob_key: file.id,
        category: 'property',
        property_id: propertyId || '',
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let error: any;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          error = await response.json();
        } catch (parseError) {
          console.log('Failed to parse JSON error response:', parseError);
          error = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
      } else {
        // If response is not JSON (e.g., HTML error page), get text content
        const textContent = await response.text();
        console.log('Non-JSON response from Django (first 500 chars):', textContent.substring(0, 500));
        error = { error: `HTTP ${response.status}: ${response.statusText} - Response was not JSON` };
      }
      
      throw new Error(`Django API error: ${error.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('File metadata saved to Django successfully:', result);
  } catch (error) {
    console.error('Failed to save file metadata to Django:', error);
    // Log more details about the error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error - is Django server running?');
    }
    // Note: We don't throw here to avoid breaking the upload flow
    // The file is already uploaded to Vercel Blob successfully
  }
}
