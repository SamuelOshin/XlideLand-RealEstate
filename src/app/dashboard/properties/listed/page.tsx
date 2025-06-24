'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Property } from '@/types';
import { listingsAPI } from '@/lib/api';
import {
  Building2,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Plus,
  MoreHorizontal,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Calendar,
  TrendingUp,
  Heart,
  MessageSquare,
  Share2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';

interface ListedProperty extends Property {
  status: 'active' | 'pending' | 'sold' | 'draft';
  views?: number;
  inquiries?: number;
  favorites?: number;
  daysOnMarket?: number;
}

export default function ListedPropertiesPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<ListedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (role !== 'seller' && role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    
    loadProperties();
  }, [isAuthenticated, role, router]);
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading properties for user role:', role);
      
      // Fetch real data from backend
      const response = await listingsAPI.getListings({
        // Add filters for user's own listings if needed
        ...(role === 'seller' && { realtor: user?.id }),
        ordering: '-list_date'
      });
      
      console.log('Listings API response:', response);
      
      if (!response || !response.results) {
        throw new Error('Invalid response format from listings API');
      }// Transform backend data to match frontend interface
      const transformedProperties: ListedProperty[] = response.results.map(listing => ({
        id: parseInt(listing.id),
        title: listing.title,
        description: listing.description || '',
        price: listing.price,
        listing_type: 'sale' as const, // Default value, update based on backend field
        property_type: 'house' as const, // Default value, update based on backend field
        location: {
          address: listing.address,
          city: listing.city,
          state: listing.state,
          zipCode: listing.zipcode,
          neighborhood: listing.city // Use city as fallback
        },
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        area: listing.sqft,
        sqft: listing.sqft,
        floors: 1, // Default value
        fireplaces: 0, // Default value
        parking_spaces: listing.garage || 0,
        garage: listing.garage || 0,
        heating: 'Central',
        cooling: 'AC',        images: [
          listing.photo_main,
          listing.photo_1,
          listing.photo_2,
          listing.photo_3,
          listing.photo_4,
          listing.photo_5,
          listing.photo_6
        ].filter(Boolean) as string[],
        features: [], // Will be populated from backend later
        realtor: listing.realtor,
        createdAt: listing.list_date,
        updatedAt: listing.list_date, // Use list_date as fallback
        isActive: listing.is_published,
        isFeatured: false, // Default value
        // Map backend fields to frontend interface
        status: listing.is_published ? 'active' : 'draft',
        views: 0, // Default values - will be from analytics
        inquiries: 0,
        favorites: 0,        daysOnMarket: 0,
      }));
      
      console.log('Transformed properties:', transformedProperties);
      setProperties(transformedProperties);
    } catch (error: any) {
      console.error('Failed to load properties:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading your properties...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Failed to Load Properties</h3>
              <p className="text-text-secondary mb-4">{error}</p>
              <Button onClick={loadProperties} className="bg-emerald-600 hover:bg-emerald-700">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listed Properties</h1>
            <p className="text-gray-600">Manage your property listings and track performance</p>
          </div>
          <InstantLoadingLink href="/dashboard/properties/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </InstantLoadingLink>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-green-600">{properties.filter(p => p.status === 'active').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{properties.reduce((sum, p) => sum + (p.views || 0), 0)}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-orange-600">{properties.reduce((sum, p) => sum + (p.inquiries || 0), 0)}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getStatusColor(property.status)}>
                    {property.status}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                  <p className="text-lg font-bold text-emerald-600">{formatPrice(property.price)}</p>
                </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{property.location.city}, {property.location.state}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.area.toLocaleString()} sqft</span>
                  </div>
                </div>
                
                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{property.views}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{property.inquiries}</p>
                    <p className="text-xs text-gray-500">Inquiries</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{property.favorites}</p>
                    <p className="text-xs text-gray-500">Favorites</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{property.daysOnMarket} days on market</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <InstantLoadingLink href={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </InstantLoadingLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'Start by adding your first property listing.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <InstantLoadingLink href="/dashboard/properties/new">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </InstantLoadingLink>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
