'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { redirectToAuth } from '@/lib/auth-utils';
import { authenticatedFetch } from '@/lib/auth-helpers';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';
import {
  Building2,
  Upload,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Calendar,
  Image as ImageIcon,
  X,
  Save,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import FileUploadDeferred from '@/components/ui/FileUploadDeferred';

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  propertyType: string;
  listingType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  features: string[];
  images: File[];
}

export default function NewPropertyPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    propertyType: 'house',
    listingType: 'sale',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    lotSize: '',
    yearBuilt: '',
    features: [],
    images: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const propertyTypes = [
    'house',
    'apartment',
    'condo',
    'townhouse',
    'villa',
    'duplex',
    'studio',
    'loft'
  ];

  const commonFeatures = [
    'Parking',
    'Garden',
    'Swimming Pool',
    'Gym',
    'Balcony',
    'Fireplace',
    'Air Conditioning',
    'Heating',
    'Security System',
    'Elevator',
    'Furnished',
    'Pet Friendly'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleImageRemoved = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    }
    setNewFeature('');
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const submissionId = 'property-submission';

    try {
      // Get user token for authentication
      if (!isAuthenticated) { // Rely on useAuth for isAuthenticated status
        toast.error('Authentication Error', {
          description: 'You are not logged in. Please log in and try again.',
          id: submissionId,
        });
        router.push('/auth/login'); // Redirect to login if not authenticated
        return;
      }
      
      // Check if token is actually available, even if isAuthenticated is true
      // This is a safeguard, authenticatedFetch should handle token refresh/existence
      const token = localStorage.getItem('access_token');
      if (!token) {
          toast.error('Authentication Error', {
              description: 'Authentication token not found. Please try logging out and logging in again.',
              id: submissionId,
          });
          router.push('/auth/login');
          return;
      }

      toast.loading('Submitting property...', { id: submissionId });

      const submissionFormData = new FormData();

      // Append property data as a JSON string
      // Exclude images from formData before stringifying, as they are handled separately
      const { images, ...propertyDetails } = formData;
      submissionFormData.append('propertyData', JSON.stringify(propertyDetails));

      // Append selected image files
      selectedImages.forEach((file) => {
        submissionFormData.append('images', file);
      });

      console.log('Submitting property with images...');

      // Single API call to /api/properties
      // authenticatedFetch will handle adding the Authorization header.
      // Content-Type for FormData is set automatically by the browser.
      const response = await authenticatedFetch('/api/properties', {
        method: 'POST',
        body: submissionFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        // It's good practice to dismiss the loading toast before showing an error
        toast.dismiss(submissionId);
        
        let errorMessage = errorData.error || `Failed to submit property (status: ${response.status})`;
        if (response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
          // Optionally redirect to login for 401 errors
          // router.push('/auth/login');
        } else if (response.status === 400) {
          errorMessage = errorData.error || 'Invalid property data. Please check your inputs.';
        }

        toast.error('Submission Failed', {
          description: errorMessage,
          id: submissionId, // Use the same ID to replace the loading toast
        });
        // No automatic redirect to login here unless it's a 401 and you decide to enforce it.
        // The error message should guide the user.
        return; // Stop further execution
      }

      const result = await response.json();
      console.log('Property submission successful:', result);
      
      toast.success('Property Created!', {
        description: 'Your property listing has been successfully created.',
        duration: 4000,
        id: submissionId, // Replace the loading toast
      });
      
      router.push('/dashboard/properties/listed');

    } catch (error) {
      console.error('Error submitting property:', error);
      toast.dismiss(submissionId); // Ensure loading toast is dismissed on any catch

      let description = 'An unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        description = error.message;
        // Specific check for authentication related errors not caught by status codes
        if (error.message.includes('Authentication') || error.message.includes('token')) {
          description = 'Your session might have expired. Please log in again.';
          // Consider redirecting to login for critical auth errors caught here
          // router.push('/auth/login');
        }
      }
      
      toast.error('Submission Error', {
        description,
        duration: 5000,
        id: submissionId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    // Implement draft saving logic
  };

  const handlePreview = () => {
    console.log('Preview property:', formData);
    // Implement preview logic
  };

  // Debug function to check authentication state
  const checkAuthState = () => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    console.log('Auth Debug:', {
      hasToken: !!token,
      tokenLength: token?.length,
      hasRefreshToken: !!refreshToken,
      user: user?.username,
      role: role,
      isAuthenticated
    });
  };

  // Call debug function when component mounts
  useEffect(() => {
    checkAuthState();
  }, [user, role, isAuthenticated]);

  // Add debug info in development
  const showDebugInfo = process.env.NODE_ENV === 'development';

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Authentication Required</h2>
            <p className="text-gray-600 mt-2">Please log in to create a property listing.</p>
          </div>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Debug Info (Development Only) */}
        {showDebugInfo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h3>
            <pre className="text-xs text-yellow-700">
              {JSON.stringify({
                isAuthenticated,
                hasUser: !!user,
                username: user?.username,
                role,
                hasAccessToken: !!localStorage.getItem('access_token'),
                hasRefreshToken: !!localStorage.getItem('refresh_token'),
                tokenPreview: localStorage.getItem('access_token')?.substring(0, 20) + '...'
              }, null, 2)}
            </pre>
            <div className="mt-2 space-x-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log('Current localStorage:', Object.keys(localStorage));
                  console.log('Auth context:', { user, isAuthenticated, role });
                }}
              >
                Log Auth State
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  localStorage.clear();
                  router.push('/auth/login');
                }}
              >
                Clear & Re-login
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
              <p className="text-gray-600">Create a new property listing</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter property title"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter property description"
                  rows={4}
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing Type
                </label>
                <select
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <Input
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  placeholder="Enter ZIP code"
                  required
                  className="bg-white/90 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <Input
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <Input
                  name="bathrooms"
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet
                </label>
                <Input
                  name="sqft"
                  type="number"
                  value={formData.sqft}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size (sq ft)
                </label>
                <Input
                  name="lotSize"
                  type="number"
                  value={formData.lotSize}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="bg-white/90 border-gray-200"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year Built
                </label>
                <Input
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="bg-white/90 border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonFeatures.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => addFeature(feature)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      formData.features.includes(feature)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  className="bg-white/90 border-gray-200"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add custom feature"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature(newFeature);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addFeature(newFeature)}
                >
                  Add
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map(feature => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
            
            {/* Property Images Deferred Upload Component */}
            <FileUploadDeferred
              uploadType="property-images"
              selectedFiles={selectedImages}
              onFilesSelected={handleImagesSelected}
              onFileRemoved={handleImageRemoved}
              onError={(error) => {
                console.error('Property images selection error:', error);
              }}
            />
          </div>

          {/* Submit */}          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 text-text-primary border border-gray-300 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
