import { NextRequest, NextResponse } from 'next/server';

interface Params {
  propertyId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Await the params Promise
    const resolvedParams = await params;
    const { propertyId } = resolvedParams;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    // Extract pagination parameters from search params
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    
    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
    }
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return NextResponse.json({ error: 'Invalid limit parameter (must be between 1 and 50)' }, { status: 400 });
    }

    // Build query string for backend request
    const queryParams = new URLSearchParams({
      page: page,
      limit: limit
    });

    // Forward request to Django backend (no auth required for public property images)
    const response = await fetch(`${backendUrl}/api/accounts/properties/${propertyId}/images/?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch property images';
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

    const imagesData = await response.json();
    return NextResponse.json(imagesData);

  } catch (error) {
    console.error('Error fetching property images:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
