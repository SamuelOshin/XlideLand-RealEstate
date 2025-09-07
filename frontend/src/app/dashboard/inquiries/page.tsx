'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Clock,
  Star,
  Eye,
  Archive,
  Reply,
  MoreHorizontal,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';

interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  priority: 'low' | 'medium' | 'high';
  date: string;
  lastResponse?: string;
  responseCount: number;
}

export default function InquiriesPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    loadInquiries();
  }, [isAuthenticated, router]);

  const loadInquiries = async () => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInquiries: Inquiry[] = [
        {
          id: '1',
          propertyId: 'prop_001',
          propertyTitle: 'Modern Downtown Condo',
          propertyAddress: '123 Main St, Downtown',
          customerName: 'Sarah Johnson',
          customerEmail: 'Opeyemib117@gmail.com',
          customerPhone: '+234 907 661 4145',
          message: 'Hi, I\'m interested in scheduling a viewing for this property. Is it available this weekend?',
          status: 'new',
          priority: 'high',
          date: '2024-01-15T10:30:00Z',
          responseCount: 0
        },
        {
          id: '2',
          propertyId: 'prop_002',
          propertyTitle: 'Spacious Family Home',
          propertyAddress: '456 Oak Ave, Suburbs',
          customerName: 'Michael Chen',
          customerEmail: 'Opeyemib117@gmail.com',
          customerPhone: '+234 907 661 4145',
          message: 'What are the monthly HOA fees for this property? Also, are pets allowed?',
          status: 'responded',
          priority: 'medium',
          date: '2024-01-14T14:45:00Z',
          lastResponse: '2024-01-14T16:20:00Z',
          responseCount: 2
        },
        {
          id: '3',
          propertyId: 'prop_003',
          propertyTitle: 'Luxury Penthouse',
          propertyAddress: '789 Sky Tower, Upper East',
          customerName: 'Emily Rodriguez',
          customerEmail: 'Opeyemib117@gmail.com',
          customerPhone: '+234 907 661 4145',
          message: 'I would like to make an offer on this property. Please contact me to discuss the terms.',
          status: 'read',
          priority: 'high',
          date: '2024-01-13T09:15:00Z',
          responseCount: 1
        },
        {
          id: '4',
          propertyId: 'prop_004',
          propertyTitle: 'Cozy Starter Home',
          propertyAddress: '321 Pine St, Midtown',
          customerName: 'David Wilson',
          customerEmail: 'Opeyemib117@gmail.com',
          customerPhone: '+234 907 661 4145',
          message: 'Can you provide more information about the neighborhood and nearby schools?',
          status: 'archived',
          priority: 'low',
          date: '2024-01-12T11:00:00Z',
          lastResponse: '2024-01-12T15:30:00Z',
          responseCount: 3
        },
        {
          id: '5',
          propertyId: 'prop_005',
          propertyTitle: 'Investment Property',
          propertyAddress: '654 Commerce Blvd, Business District',
          customerName: 'Lisa Thompson',
          customerEmail: 'Opeyemib117@gmail.com',
          customerPhone: '+234 907 661 4145',
          message: 'What is the current rental yield on this property? I\'m considering it as an investment.',
          status: 'new',
          priority: 'medium',
          date: '2024-01-11T16:20:00Z',
          responseCount: 0
        }
      ];

      setInquiries(mockInquiries);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = searchTerm === '' || 
      inquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || inquiry.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
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

  const handleStatusUpdate = (inquiryId: string, newStatus: Inquiry['status']) => {
    setInquiries(prev => prev.map(inquiry => 
      inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    ));
  };

  const handleSendResponse = async () => {
    if (!selectedInquiry || !responseText.trim()) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update inquiry status
      handleStatusUpdate(selectedInquiry.id, 'responded');
      setResponseText('');
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
              <p className="text-gray-600">Manage customer inquiries and messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {filteredInquiries.filter(i => i.status === 'new').length} New
            </Badge>
            <Badge variant="outline" className="text-sm">
              {filteredInquiries.length} Total
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                  ? 'Try adjusting your filters to see more results.'
                  : 'Customer inquiries will appear here when they contact you about properties.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                        <Badge className={getPriorityColor(inquiry.priority)}>
                          {inquiry.priority} priority
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(inquiry.date)}
                        </span>
                      </div>

                      {/* Property Info */}
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <InstantLoadingLink
                          href={`/dashboard/properties/detail/${inquiry.propertyId}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {inquiry.propertyTitle}
                        </InstantLoadingLink>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{inquiry.propertyAddress}</span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{inquiry.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{inquiry.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{inquiry.customerPhone}</span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-700">{inquiry.message}</p>
                      </div>

                      {/* Response Info */}
                      {inquiry.responseCount > 0 && (
                        <div className="text-sm text-gray-500">
                          {inquiry.responseCount} response(s) • Last: {inquiry.lastResponse && formatDate(inquiry.lastResponse)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          if (inquiry.status === 'new') {
                            handleStatusUpdate(inquiry.id, 'read');
                          }
                        }}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(inquiry.id, 'archived')}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Response Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reply to {selectedInquiry.customerName}
                  </h3>
                  <button
                    onClick={() => setSelectedInquiry(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Original Message */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Original message:</p>
                  <p className="text-gray-800">{selectedInquiry.message}</p>
                </div>

                {/* Response Textarea */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedInquiry(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendResponse}
                    disabled={!responseText.trim()}
                  >
                    Send Response
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
