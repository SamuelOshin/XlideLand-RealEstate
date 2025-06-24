'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Book,
  Video,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Zap,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'
import { toast } from 'sonner'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
  isExpanded?: boolean
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  lastUpdated: string
  category: string
}

interface ContactOption {
  type: 'chat' | 'email' | 'phone' | 'help-center'
  title: string
  description: string
  availability: string
  responseTime: string
  icon: any
}

export default function SupportPage() {
  const { user, role } = useAuth()
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets' | 'resources'>('faq')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingTicket, setSubmittingTicket] = useState(false)

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium' as const,
    description: ''
  })

  useEffect(() => {
    loadSupportData()
  }, [])

  const loadSupportData = async () => {
    setLoading(true)
    
    // Mock FAQ data
    const mockFAQs: FAQItem[] = [
      {
        id: '1',
        question: 'How do I search for properties?',
        answer: 'You can search for properties using our advanced search feature. Navigate to the Properties page and use filters like location, price range, property type, bedrooms, and more to find your perfect match.',
        category: 'properties',
        helpful: 45,
        notHelpful: 3
      },
      {
        id: '2',
        question: 'How do I schedule a property tour?',
        answer: 'To schedule a tour, visit the property detail page and click the "Schedule Tour" button. You can choose from available time slots or request a custom time. The property agent will confirm your appointment.',
        category: 'tours',
        helpful: 38,
        notHelpful: 2
      },
      {
        id: '3',
        question: 'How do I save properties to my favorites?',
        answer: 'Click the heart icon on any property card or detail page to save it to your favorites. You can view all saved properties in your Dashboard under "Saved Properties".',
        category: 'properties',
        helpful: 52,
        notHelpful: 1
      },
      {
        id: '4',
        question: 'How do I contact a realtor?',
        answer: 'You can contact realtors through multiple ways: click "Contact Agent" on property pages, use the messaging system in your dashboard, or call the phone number listed on their profile.',
        category: 'contact',
        helpful: 41,
        notHelpful: 4
      },
      {
        id: '5',
        question: 'How do I change my account settings?',
        answer: 'Go to your Dashboard and click on "Settings" in the navigation menu. Here you can update your profile information, notification preferences, privacy settings, and more.',
        category: 'account',
        helpful: 29,
        notHelpful: 2
      },
      {
        id: '6',
        question: 'How do I list my property for sale?',
        answer: 'To list your property, you need a seller account. Go to your Dashboard and click "List Property". Fill out all required information including photos, description, and pricing. Our team will review and publish your listing.',
        category: 'selling',
        helpful: 67,
        notHelpful: 5
      }
    ]

    // Mock tickets data
    const mockTickets: SupportTicket[] = [
      {
        id: 'TKT-001',
        subject: 'Unable to upload property photos',
        status: 'in-progress',
        priority: 'medium',
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdated: '2024-01-15T14:20:00Z',
        category: 'technical'
      },
      {
        id: 'TKT-002',
        subject: 'Question about commission rates',
        status: 'resolved',
        priority: 'low',
        createdAt: '2024-01-12T09:15:00Z',
        lastUpdated: '2024-01-13T16:45:00Z',
        category: 'billing'
      },
      {
        id: 'TKT-003',
        subject: 'Property not showing in search results',
        status: 'open',
        priority: 'high',
        createdAt: '2024-01-14T16:20:00Z',
        lastUpdated: '2024-01-14T16:20:00Z',
        category: 'technical'
      }
    ]

    setFaqs(mockFAQs)
    setTickets(mockTickets)
    setTimeout(() => setLoading(false), 1000)
  }

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq
    ))
  }

  const rateFAQ = (id: string, helpful: boolean) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id 
        ? { 
            ...faq, 
            helpful: helpful ? faq.helpful + 1 : faq.helpful,
            notHelpful: !helpful ? faq.notHelpful + 1 : faq.notHelpful
          }
        : faq
    ))
    toast.success('Thank you for your feedback!')
  }

  const submitTicket = async () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmittingTicket(true)
    try {
      // API call to submit ticket
      const ticketId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`
      const newSupportTicket: SupportTicket = {
        id: ticketId,
        subject: newTicket.subject,
        status: 'open',
        priority: newTicket.priority,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        category: newTicket.category
      }
      
      setTickets(prev => [newSupportTicket, ...prev])
      setNewTicket({
        subject: '',
        category: '',
        priority: 'medium',
        description: ''
      })
      toast.success(`Support ticket ${ticketId} created successfully!`)
      setActiveTab('tickets')
    } catch (error) {
      toast.error('Failed to submit ticket. Please try again.')
    } finally {
      setSubmittingTicket(false)
    }
  }

  const contactOptions: ContactOption[] = [
    {
      type: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: '24/7',
      responseTime: 'Usually within 2 minutes',
      icon: MessageCircle
    },
    {
      type: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Always available',
      responseTime: 'Usually within 4 hours',
      icon: Mail
    },
    {
      type: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri 9 AM - 6 PM EST',
      responseTime: 'Immediate',
      icon: Phone
    },
    {
      type: 'help-center',
      title: 'Help Center',
      description: 'Browse our comprehensive guides',
      availability: '24/7',
      responseTime: 'Self-service',
      icon: Book
    }
  ]

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'properties', label: 'Properties' },
    { value: 'tours', label: 'Tours & Appointments' },
    { value: 'account', label: 'Account & Settings' },
    { value: 'selling', label: 'Selling' },
    { value: 'contact', label: 'Contact & Messaging' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'billing', label: 'Billing & Payments' }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading support center...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-2">
              Get help with XlideLand and find answers to your questions
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'faq', label: 'FAQ', icon: HelpCircle },
                  { id: 'contact', label: 'Contact Us', icon: MessageCircle },
                  { id: 'tickets', label: 'My Tickets', icon: FileText },
                  { id: 'resources', label: 'Resources', icon: Book }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                        activeTab === tab.id
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                      {tab.id === 'tickets' && tickets.length > 0 && (
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800">
                          {tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="p-6">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                      <p className="text-gray-600">
                        Try adjusting your search or browse all categories
                      </p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg bg-white"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <h4 className="text-sm font-medium text-gray-900">
                            {faq.question}
                          </h4>
                          {faq.isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        {faq.isExpanded && (
                          <div className="px-6 pb-4">
                            <p className="text-sm text-gray-600 mb-4">
                              {faq.answer}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-4">
                                <span className="text-xs text-gray-500">Was this helpful?</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => rateFAQ(faq.id, true)}
                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => rateFAQ(faq.id, false)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {faq.helpful} helpful • {faq.notHelpful} not helpful
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How would you like to contact us?</h3>
                  <p className="text-gray-600">Choose the method that works best for you</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {contactOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <div
                        key={option.type}
                        className="p-6 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {option.title}
                            </h4>
                            <p className="text-gray-600 mb-3">
                              {option.description}
                            </p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center text-gray-600">
                                <Clock className="w-3 h-3 mr-2" />
                                {option.availability}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Zap className="w-3 h-3 mr-2" />
                                {option.responseTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Quick Contact Form */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Submit a Support Ticket</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select a category</option>
                        {categories.slice(1).map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      rows={4}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Please provide as much detail as possible about your issue..."
                    />
                  </div>
                  <Button
                    onClick={submitTicket}
                    disabled={submittingTicket}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Support Tickets</h3>
                  <p className="text-gray-600">Track the status of your support requests</p>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't submitted any support tickets yet
                    </p>
                    <Button
                      onClick={() => setActiveTab('contact')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Create Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-4 border border-gray-200 rounded-lg bg-white hover:border-emerald-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {ticket.subject}
                              </h4>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace('-', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Ticket ID: {ticket.id}</p>
                              <p>Category: {ticket.category}</p>
                              <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                              <p>Last Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Help Resources</h3>
                  <p className="text-gray-600">Guides, tutorials, and documentation to help you get the most out of XlideLand</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Getting Started Guide',
                      description: 'Learn the basics of using XlideLand',
                      type: 'guide',
                      icon: Book,
                      duration: '5 min read'
                    },
                    {
                      title: 'Property Search Tutorial',
                      description: 'Master our advanced search features',
                      type: 'video',
                      icon: Video,
                      duration: '3 min watch'
                    },
                    {
                      title: 'Dashboard Overview',
                      description: 'Tour of your personal dashboard',
                      type: 'guide',
                      icon: Book,
                      duration: '4 min read'
                    },
                    {
                      title: 'Messaging System',
                      description: 'How to communicate with agents',
                      type: 'video',
                      icon: Video,
                      duration: '2 min watch'
                    },
                    {
                      title: 'Property Alerts Setup',
                      description: 'Configure notifications for new listings',
                      type: 'guide',
                      icon: Book,
                      duration: '3 min read'
                    },
                    {
                      title: 'API Documentation',
                      description: 'Technical documentation for developers',
                      type: 'docs',
                      icon: FileText,
                      duration: 'Reference'
                    }
                  ].map((resource, index) => {
                    const Icon = resource.icon
                    return (
                      <div
                        key={index}
                        className="p-6 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              {resource.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {resource.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {resource.type}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {resource.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
