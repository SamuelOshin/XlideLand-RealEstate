'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api';
import {
  Building2,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Flag,
  AlertTriangle,
  MapPin,
  DollarSign,
  Calendar,
  User,
  MoreHorizontal,
  ExternalLink,
  Clock,
  MessageSquare,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';

interface PropertyModeration {
  id: string;
  propertyId: string;
  title: string;
  address: string;
  price: number;
  agentName: string;
  agentEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'under_review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  reason?: string;
  notes?: string;
  reportCount: number;
  images: string[];
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

export default function PropertyModerationPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();  const [properties, setProperties] = useState<PropertyModeration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<PropertyModeration | null>(null);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | 'flag'>('approve');
  const [moderationNotes, setModerationNotes] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadProperties();
  }, [isAuthenticated, role, router]);
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real moderation data from backend
      const response = await api.get('/api/listings/admin/moderation/');
      
      // Check if we have results (paginated response) or direct array
      const moderationData = response.data.results || response.data;
      
      if (!Array.isArray(moderationData)) {
        throw new Error('Invalid response format: expected array of moderation items');
      }
      
      // Transform backend data to match frontend interface
      const transformedProperties: PropertyModeration[] = moderationData.map((item: any) => ({
        id: item.id.toString(),
        propertyId: item.listing.id.toString(),
        title: item.listing.title,
        address: `${item.listing.address}, ${item.listing.city}`,
        price: item.listing.price,        agentName: item.listing.realtor_name || 'Unknown Agent',
        agentEmail: item.listing.realtor_email || 'agent@example.com',
        status: item.status,
        priority: item.priority,
        submittedDate: item.submitted_date,
        reviewedDate: item.reviewed_date,
        reviewedBy: item.reviewed_by_name,
        reason: item.reason || '',
        notes: item.notes || '',
        reportCount: item.report_count || 0,
        images: [
          item.listing.photo_main,
          item.listing.photo_1,
          item.listing.photo_2,
          item.listing.photo_3
        ].filter(Boolean),
        propertyType: item.listing.property_type,
        bedrooms: item.listing.bedrooms,
        bathrooms: parseFloat(item.listing.bathrooms) || 0,        sqft: item.listing.sqft,
        yearBuilt: item.listing.year_built
      }));
      
      setProperties(transformedProperties);
    } catch (error: any) {
      console.error('Failed to load moderation data:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Failed to load properties for moderation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle property moderation actions
  const handleModerationAction = async (propertyId: string, action: 'approve' | 'reject' | 'flag', reason?: string) => {
    try {
      const endpoint = action === 'approve' 
        ? `/api/listings/admin/moderation/${propertyId}/approve/`
        : action === 'reject'
          ? `/api/listings/admin/moderation/${propertyId}/reject/`
          : `/api/listings/admin/moderation/${propertyId}/flag/`;
      
      const data = (action === 'reject' || action === 'flag') ? { reason: reason || moderationNotes } : {};
      
      await api.post(endpoint, data);
      
      // Reload properties after action
      await loadProperties();
      
      // Close modal and reset
      setShowModerationModal(false);
      setModerationNotes('');
      setSelectedProperty(null);
    } catch (error: any) {
      console.error('Failed to moderate property:', error);
      setError(error.response?.data?.message || `Failed to ${action} property. Please try again.`);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || property.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const handleModerationSubmit = async () => {
    if (!selectedProperty) return;
    
    try {
      await handleModerationAction(selectedProperty.id, moderationAction, moderationNotes);
    } catch (error) {
      console.error('Error submitting moderation:', error);
    }
  };

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-text-secondary">Loading property moderation queue...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Failed to Load Moderation Queue</h3>
            <p className="text-text-secondary mb-4">{error}</p>
            <Button onClick={loadProperties} className="bg-emerald-600 hover:bg-emerald-700">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Moderation</h1>
              <p className="text-gray-600">Review and moderate property listings</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {properties.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {properties.filter(p => p.status === 'rejected').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-orange-600">
                  {properties.filter(p => p.status === 'flagged').length}
                </p>
              </div>
              <Flag className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reports</p>
                <p className="text-2xl font-bold text-red-600">
                  {properties.reduce((sum, p) => sum + p.reportCount, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 h-4 w-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
                <option value="under_review">Under Review</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          {filteredProperties.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Properties awaiting moderation will appear here.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {property.title}
                            </h3>
                            <Badge className={getStatusColor(property.status)}>
                              {property.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(property.priority)}>
                              {property.priority}
                            </Badge>
                            {property.reportCount > 0 && (
                              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                                <Flag className="h-3 w-3" />
                                {property.reportCount} reports
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{property.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">{formatPrice(property.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>{property.propertyType}</span>
                        {property.bedrooms > 0 && <span>{property.bedrooms} bed</span>}
                        {property.bathrooms > 0 && <span>{property.bathrooms} bath</span>}
                        <span>{property.sqft.toLocaleString()} sqft</span>
                      </div>

                      {/* Agent Info */}
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{property.agentName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{property.agentEmail}</span>
                      </div>

                      {/* Timestamps */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {formatDate(property.submittedDate)}</span>
                        </div>
                        {property.reviewedDate && (
                          <div className="flex items-center gap-1">
                            <span>Reviewed: {formatDate(property.reviewedDate)}</span>
                            {property.reviewedBy && <span>by {property.reviewedBy}</span>}
                          </div>
                        )}
                      </div>

                      {/* Rejection Reason */}
                      {property.reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-sm text-red-800">
                            <strong>Reason:</strong> {property.reason}
                          </p>
                          {property.notes && (
                            <p className="text-sm text-red-700 mt-1">
                              <strong>Notes:</strong> {property.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <InstantLoadingLink
                        href={`/dashboard/properties/detail/${property.propertyId}`}
                      >
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </InstantLoadingLink>
                      {property.status === 'pending' || property.status === 'under_review' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setModerationAction('approve');
                              setShowModerationModal(true);
                            }}
                            className="text-green-600 hover:text-green-700 bg-white/80 border-emerald-200 hover:from-emerald-100 hover:to-green-100"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setModerationAction('reject');
                              setShowModerationModal(true);
                            }}
                            className="text-red-600 hover:text-red-700 bg-white/80 "
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setModerationAction('flag');
                              setShowModerationModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-700 bg-white/80"
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProperty(property);
                            setModerationAction('approve');
                            setShowModerationModal(true);
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Moderation Modal */}
        {showModerationModal && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {moderationAction === 'approve' ? 'Approve' : 
                     moderationAction === 'reject' ? 'Reject' : 'Flag'} Property
                  </h3>
                  <button
                    onClick={() => setShowModerationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Property Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedProperty.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{selectedProperty.address}</p>
                  <p className="text-sm text-gray-600">
                    Agent: {selectedProperty.agentName} ({selectedProperty.agentEmail})
                  </p>
                </div>

                {/* Notes/Reason */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {moderationAction === 'approve' ? 'Notes (Optional)' : 
                     moderationAction === 'reject' ? 'Rejection Reason' : 'Flag Reason'}
                  </label>
                  <Textarea
                    value={moderationNotes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setModerationNotes(e.target.value)}
                    placeholder={
                      moderationAction === 'approve' 
                        ? 'Add any notes about this approval...'
                        : moderationAction === 'reject'
                        ? 'Explain why this property is being rejected...'
                        : 'Explain why this property is being flagged...'
                    }
                    rows={4}
                    required={moderationAction !== 'approve'}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowModerationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleModerationSubmit}
                    disabled={moderationAction !== 'approve' && !moderationNotes.trim()}
                    className={
                      moderationAction === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700'
                        : moderationAction === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-orange-600 hover:bg-orange-700'
                    }
                  >
                    {moderationAction === 'approve' ? 'Approve' : 
                     moderationAction === 'reject' ? 'Reject' : 'Flag'} Property
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
