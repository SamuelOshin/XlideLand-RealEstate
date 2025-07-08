import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authorization token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('file_type');
    const category = searchParams.get('category');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (fileType) queryParams.append('file_type', fileType);
    if (category) queryParams.append('category', category);
    
    const queryString = queryParams.toString();
    const url = `${backendUrl}/api/accounts/files/user/${queryString ? `?${queryString}` : ''}`;

    // Forward request to Django backend
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch user files';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
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
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const filesData = await response.json();
    return NextResponse.json(filesData);

  } catch (error) {
    console.error('Error fetching user files:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
