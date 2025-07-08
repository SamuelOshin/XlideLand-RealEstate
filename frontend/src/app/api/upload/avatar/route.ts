import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// File validation utilities for avatars
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB for avatars
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Function to get user from token
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
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
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

interface UploadResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

// Utility function to validate avatar files
function validateAvatarFile(file: File): string | null {
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

// Utility function to generate unique filename for avatar
function generateAvatarFilename(userId: string, originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `avatars/${userId}/${timestamp}.${extension}`;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validationError = validateAvatarFile(file);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    try {
      // Generate filename with user ID
      const userId = user.id?.toString() || 'unknown';
      const filename = generateAvatarFilename(userId, file.name);

      // Upload to Vercel Blob
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

      // Update user profile in Django backend
      await updateUserAvatarInDjango(uploadResponse, token);

      // Return successful upload
      return NextResponse.json({
        message: 'Avatar uploaded successfully',
        file: uploadResponse,
      });

    } catch (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload avatar' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user avatar in Django
async function updateUserAvatarInDjango(
  file: UploadResponse, 
  token: string
): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    // Store file metadata
    const response = await fetch(`${apiUrl}/api/accounts/files/store-metadata/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        file_name: file.name,
        original_name: file.name,
        file_type: 'avatar',
        mime_type: file.type,
        file_size: file.size,
        blob_url: file.url,
        blob_key: file.id,
        category: 'profile',
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.error || error.message || 'Unknown error';
        } else {
          // Handle HTML error responses
          const errorText = await response.text();
          console.error('Django HTML error response:', errorText);
          errorMessage = `Django API error (${response.status}): ${response.statusText}`;
        }
      } catch (parseError) {
        console.error('Error parsing Django response:', parseError);
        errorMessage = `Django API error (${response.status}): ${response.statusText}`;
      }
      throw new Error(`Django API error: ${errorMessage}`);
    }

    const result = await response.json();
    console.log('Avatar metadata saved to Django:', result);
  } catch (error) {
    console.error('Failed to update user avatar in Django:', error);
    // Note: We don't throw here to avoid breaking the upload flow
  }
}
