import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// File validation utilities
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for documents
const ALLOWED_DOCUMENT_TYPES = process.env.ALLOWED_DOCUMENT_TYPES?.split(',') || ['application/pdf', 'text/plain'];
const MAX_FILES = 5; // Limit documents per upload

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
  category?: string;
}

// Utility function to validate document files
function validateDocumentFile(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
  }

  // Check file type
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return `File type ${file.type} not allowed. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`;
  }

  return null;
}

// Utility function to generate unique filename
function generateUniqueFilename(originalName: string, category: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const extension = originalName.split('.').pop();
  return `documents/${category}/${timestamp}-${randomStr}.${extension}`;
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
    const files = formData.getAll('file') as File[];
    const category = (formData.get('category') as string) || 'general';
    const propertyId = formData.get('property_id') as string;

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} documents allowed per upload` },
        { status: 400 }
      );
    }

    // Validate each file
    const validationErrors: string[] = [];
    for (const file of files) {
      const error = validateDocumentFile(file);
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
        const filename = generateUniqueFilename(file.name, category);
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
          category,
        };

        // Save file metadata to Django backend
        await saveDocumentMetadataToDjango(uploadResponse, propertyId, token);

        return uploadResponse;
      } catch (uploadError) {
        console.error('Upload error for document:', file.name, uploadError);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      uploadedFiles.push(...results);
    } catch (uploadError) {
      return NextResponse.json(
        { error: 'Some documents failed to upload', details: uploadError },
        { status: 500 }
      );
    }

    // Return successful uploads
    return NextResponse.json({
      message: `Successfully uploaded ${uploadedFiles.length} document(s)`,
      files: uploadedFiles,
      category,
    });

  } catch (error) {
    console.error('Documents upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to save document metadata to Django
async function saveDocumentMetadataToDjango(
  file: UploadResponse, 
  propertyId: string | null, 
  token: string
): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    const response = await fetch(`${apiUrl}/api/accounts/files/store-metadata/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        file_name: file.name,
        original_name: file.name,
        file_type: 'document',
        mime_type: file.type,
        file_size: file.size,
        blob_url: file.url,
        blob_key: file.id,
        category: file.category || 'general',
        property_id: propertyId || '',
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
    console.log('Document metadata saved to Django:', result);
  } catch (error) {
    console.error('Failed to save document metadata to Django:', error);
    // Note: We don't throw here to avoid breaking the upload flow
  }
}
