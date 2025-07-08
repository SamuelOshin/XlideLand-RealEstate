import { useState, useEffect } from 'react';

interface PropertyImage {
  id?: string;
  file_name?: string;
  blob_url?: string;
  url?: string;
  type?: string;
  is_main?: boolean;
  uploaded_at?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total_images: number;
  total_uploaded_images: number;
  total_traditional_photos: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

interface PropertyImagesData {
  uploaded_images: PropertyImage[];
  traditional_photos: PropertyImage[];
  pagination: PaginationInfo;
  property_id: string;
}

interface UsePropertyImagesOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function usePropertyImages(
  propertyId: string | null, 
  options: UsePropertyImagesOptions = {}
) {
  const { page = 1, limit = 10, enabled = true } = options;
  
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchImages = async (pageNum = page, limitNum = limit) => {
    if (!propertyId || !enabled) {
      setImages([]);
      setPagination(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: limitNum.toString(),
      });

      const response = await fetch(`/api/properties/${propertyId}/images?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch property images');
      }

      const data: PropertyImagesData = await response.json();
      
      // Combine uploaded images and traditional photos
      const allImages: PropertyImage[] = [
        ...data.uploaded_images.map(img => ({
          ...img,
          url: img.blob_url,
          type: 'uploaded'
        })),
        ...data.traditional_photos.map(img => ({
          ...img,
          type: 'traditional'
        }))
      ];

      setImages(allImages);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching property images:', err);
      setImages([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && (pagination?.total_pages === undefined || pageNum <= pagination.total_pages)) {
      fetchImages(pageNum, limit);
    }
  };

  const nextPage = () => {
    if (pagination?.has_next) {
      goToPage(pagination.page + 1);
    }
  };

  const previousPage = () => {
    if (pagination?.has_previous) {
      goToPage(pagination.page - 1);
    }
  };

  useEffect(() => {
    fetchImages(page, limit);
  }, [propertyId, page, limit, enabled]);

  return { 
    images, 
    loading, 
    error, 
    pagination,
    refetch: () => fetchImages(page, limit),
    goToPage,
    nextPage,
    previousPage,
    isEmpty: images.length === 0,
    mainImage: images.find(img => img.is_main) || images[0] || null,
    // Legacy support
    totalImages: pagination?.total_images || 0,
  };
}

// Legacy hook for backward compatibility (non-paginated)
export function useAllPropertyImages(propertyId: string | null) {
  return usePropertyImages(propertyId, { limit: 50 }); // Get up to 50 images at once
}
