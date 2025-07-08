'use client';

import React, { useState } from 'react';
import { usePropertyImages } from '@/hooks/usePropertyImages';
import SafeImage from '@/components/ui/SafeImage';
import Pagination from '@/components/ui/Pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Image as ImageIcon, Download, Share2 } from 'lucide-react';

interface PropertyImageGalleryProps {
  propertyId: string;
  title?: string;
  showTitle?: boolean;
  imagesPerPage?: number;
  viewMode?: 'grid' | 'list';
  showControls?: boolean;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  propertyId,
  title = 'Property Images',
  showTitle = true,
  imagesPerPage = 12,
  viewMode: initialViewMode = 'grid',
  showControls = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(initialViewMode);
  
  const { 
    images, 
    loading, 
    error, 
    pagination,
    goToPage,
    nextPage,
    previousPage,
    refetch 
  } = usePropertyImages(propertyId, { 
    page: currentPage, 
    limit: imagesPerPage 
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    goToPage(page);
  };

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'property-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleShare = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Property Image',
          url: imageUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(imageUrl);
      alert('Image URL copied to clipboard!');
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Error loading images: {error}</p>
            <Button onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>{title}</span>
              {pagination && (
                <Badge variant="secondary" className="ml-2">
                  {pagination.total_images} images
                </Badge>
              )}
            </CardTitle>
            
            {showControls && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-2 text-gray-600">Loading images...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No images available for this property</p>
          </div>
        ) : (
          <>
            {/* Images Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                : "space-y-4"
            }>
              {images.map((image, index) => (
                <div 
                  key={image.id || index} 
                  className={`group relative ${
                    viewMode === 'list' ? 'flex items-center space-x-4 p-4 border rounded-lg' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden rounded-lg ${
                    viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'
                  }`}>
                    <SafeImage
                      src={image.url || image.blob_url || ''}
                      alt={image.file_name || `Property image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      fallbackSrc="/img/mock-property/1.jpg"
                    />
                    
                    {image.is_main && (
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        Main
                      </Badge>
                    )}

                    {/* Image Overlay Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(image.url || image.blob_url || '', image.file_name || 'image.jpg')}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleShare(image.url || image.blob_url || '')}
                        className="h-8 w-8 p-0"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {viewMode === 'list' && (
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {image.file_name || `Image ${index + 1}`}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Type: {image.type || 'Unknown'}
                      </p>
                      {image.uploaded_at && (
                        <p className="text-xs text-gray-400">
                          Uploaded: {new Date(image.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-6 border-t pt-6">
                <Pagination
                  pagination={{
                    page: pagination.page,
                    limit: pagination.limit,
                    total: pagination.total_images,
                    pages: pagination.total_pages,
                    has_next: pagination.has_next,
                    has_previous: pagination.has_previous,
                    next_page: pagination.next_page,
                    previous_page: pagination.previous_page,
                  }}
                  onPageChange={handlePageChange}
                  onNext={nextPage}
                  onPrevious={previousPage}
                  loading={loading}
                  className="justify-center"
                />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyImageGallery;
