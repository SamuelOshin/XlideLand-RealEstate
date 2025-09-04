'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { contactsAPI } from '@/lib/api';
import { Contact, ContactStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Download,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Edit,
  MoreHorizontal,
  TrendingUp,
  Users,
  MessageCircle,
  PhoneCall,
  X
} from 'lucide-react';

const ContactsAdminPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    loadContacts();
    loadStats();
  }, [statusFilter, typeFilter, searchQuery]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.contact_type = typeFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await contactsAPI.getContacts(params);
      setContacts(response.results);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await contactsAPI.getContactStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const updateContactStatus = async (contactId: number, status: string) => {
    try {
      await contactsAPI.updateContact(contactId, { status });
      loadContacts();
      loadStats();
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property': return Building2;
      case 'viewing': return Eye;
      case 'consultation': return User;
      case 'support': return MessageCircle;
      default: return MessageSquare;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">Manage customer inquiries and communications</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_contacts}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.new_contacts}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recent_contacts}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PhoneCall className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Types</option>
                <option value="general">General</option>
                <option value="property">Property</option>
                <option value="viewing">Viewing</option>
                <option value="consultation">Consultation</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Loading contacts...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const TypeIcon = getTypeIcon(contact.contact_type || 'general');
                    return (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                              <div className="text-sm text-gray-500">{contact.email}</div>
                              {contact.phone && (
                                <div className="text-sm text-gray-500">{contact.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {contact.contact_type_display || 'General'}
                              </div>
                              {contact.subject && (
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {contact.subject}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(contact.status || 'new')}>
                            {contact.status_display || 'New'}
                          </Badge>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {contact.property_type_display && (
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-3 w-3 text-gray-400" />
                                <span>{contact.property_type_display}</span>
                              </div>
                            )}
                            {contact.budget_range_display && (
                              <div className="text-xs text-gray-500 mt-1">
                                Budget: {contact.budget_range_display}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {contact.contact_date ? formatDate(contact.contact_date) : 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedContact(contact);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {contact.phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`tel:${contact.phone}`)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`mailto:${contact.email}`)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                            
                            <select
                              value={contact.status || 'new'}
                              onChange={(e) => updateContactStatus(contact.id as number, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {isDetailsOpen && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsDetailsOpen(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{selectedContact.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm text-gray-900">{selectedContact.contact_type_display}</p>
                    </div>
                  </div>

                  {selectedContact.subject && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subject</label>
                      <p className="text-sm text-gray-900">{selectedContact.subject}</p>
                    </div>
                  )}

                  {selectedContact.message && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Message</label>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    {selectedContact.property_type_display && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Property Type</label>
                        <p className="text-sm text-gray-900">{selectedContact.property_type_display}</p>
                      </div>
                    )}
                    {selectedContact.budget_range_display && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Budget</label>
                        <p className="text-sm text-gray-900">{selectedContact.budget_range_display}</p>
                      </div>
                    )}
                    {selectedContact.timeline_display && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Timeline</label>
                        <p className="text-sm text-gray-900">{selectedContact.timeline_display}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${selectedContact.phone}`)}
                  disabled={!selectedContact.phone}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedContact.email}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ContactsAdminPage;