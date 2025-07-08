'use client';

import React, { useState } from 'react';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PropertyImagesTestPage: React.FC = () => {
  const [propertyId, setPropertyId] = useState('1'); // Default property ID
  const [imagesPerPage, setImagesPerPage] = useState(12);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Property Images Pagination Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="propertyId" className="text-sm font-medium">Property ID</label>
              <Input
                id="propertyId"
                type="text"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="Enter property ID"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="imagesPerPage" className="text-sm font-medium">Images Per Page</label>
              <Input
                id="imagesPerPage"
                type="number"
                min="1"
                max="50"
                value={imagesPerPage}
                onChange={(e) => setImagesPerPage(parseInt(e.target.value) || 12)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Refresh Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid View Gallery */}
      <PropertyImageGallery
        propertyId={propertyId}
        title="Property Images - Grid View"
        imagesPerPage={imagesPerPage}
        viewMode="grid"
        showControls={true}
      />

      {/* List View Gallery */}
      <PropertyImageGallery
        propertyId={propertyId}
        title="Property Images - List View"
        imagesPerPage={Math.floor(imagesPerPage / 2)} // Show fewer in list view
        viewMode="list"
        showControls={false}
      />

      {/* Compact Gallery without title */}
      <Card>
        <CardHeader>
          <CardTitle>Compact Gallery (No Title, No Controls)</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyImageGallery
            propertyId={propertyId}
            showTitle={false}
            imagesPerPage={6}
            viewMode="grid"
            showControls={false}
          />
        </CardContent>
      </Card>

      {/* API Test Information */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Frontend API:</strong> <code>/api/properties/{propertyId}/images?page=1&limit=10</code></p>
            <p><strong>Backend API:</strong> <code>/api/accounts/properties/{propertyId}/images/?page=1&limit=10</code></p>
            <p><strong>Example URLs:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>/api/properties/{propertyId}/images?page=1&limit=5</code></li>
              <li><code>/api/properties/{propertyId}/images?page=2&limit=10</code></li>
              <li><code>/api/properties/{propertyId}/images?page=1&limit=20</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyImagesTestPage;
