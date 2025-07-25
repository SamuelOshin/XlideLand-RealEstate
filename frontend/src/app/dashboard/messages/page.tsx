'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { conversationsAPI } from '@/lib/api'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  Star,
  Paperclip,
  MoreHorizontal,
  Clock,
  Check,
  CheckCheck,
  User,
  Building2,
  Filter,
  Archive,
  Trash2,
  Reply,
  RefreshCw,
  AlertCircle,
  Plus
} from 'lucide-react'

// Custom interfaces for mock data
interface MockParticipant {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  online: boolean;
  lastSeen: string | null;
}

interface MockProperty {
  title: string;
  address: string;
  price: number;
}

interface MockMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: string;
  read: boolean;
}

interface MockConversation {
  id: string;
  participants: MockParticipant[];
  propertyId: string;
  property: MockProperty;
  lastMessage: MockMessage;
  unreadCount: number;
  priority: string;
  archived: boolean;
}

// Mock data for development
const mockConversations: MockConversation[] = [
  {
    id: '1',
    participants: [
      {
        id: 'agent-1',
        name: 'Sarah Johnson',
        role: 'agent',
        avatar: null,
        online: true,
        lastSeen: null
      }
    ],
    propertyId: 'prop-1',
    property: {
      title: 'Modern Downtown Luxury Condo',
      address: '123 Financial District, Boston, MA',
      price: 750000
    },
    lastMessage: {
      id: 'msg-3',
      senderId: 'agent-1',
      content: 'I have some additional floor plans to share with you. When would be a good time for a call?',
      timestamp: '2024-12-19T14:30:00Z',
      type: 'text',
      read: false
    },
    unreadCount: 2,
    priority: 'high',
    archived: false
  },
  {
    id: '2',
    participants: [
      {
        id: 'agent-2',
        name: 'Michael Chen',
        role: 'agent',
        avatar: null,
        online: false,
        lastSeen: '2024-12-19T12:00:00Z'
      }
    ],
    propertyId: 'prop-2',
    property: {
      title: 'Charming Victorian Family Home',
      address: '456 Beacon Hill, Boston, MA',
      price: 950000
    },
    lastMessage: {
      id: 'msg-6',
      senderId: 'user',
      content: 'Thank you for the virtual tour. I\'d like to schedule an in-person viewing.',
      timestamp: '2024-12-19T11:45:00Z',
      type: 'text',
      read: true
    },
    unreadCount: 0,
    priority: 'medium',
    archived: false
  },
  {
    id: '3',
    participants: [
      {
        id: 'agent-3',
        name: 'Emily Rodriguez',
        role: 'agent',
        avatar: null,
        online: true,
        lastSeen: null
      }
    ],
    propertyId: 'prop-3',
    property: {
      title: 'Waterfront Penthouse Suite',
      address: '789 Harbor View, Boston, MA',
      price: 1250000
    },
    lastMessage: {
      id: 'msg-9',
      senderId: 'agent-3',
      content: 'The seller is open to negotiation. Let me know if you\'d like to make an offer.',
      timestamp: '2024-12-18T16:20:00Z',
      type: 'text',
      read: true
    },
    unreadCount: 0,
    priority: 'low',
    archived: false
  }
]

const mockMessages: Record<string, MockMessage[]> = {
  '1': [
    {
      id: 'msg-1',
      senderId: 'agent-1',
      content: 'Hello! I\'m Sarah, your agent for the Modern Downtown Luxury Condo. I\'m excited to help you with this property!',
      timestamp: '2024-12-19T10:00:00Z',
      type: 'text',
      read: true
    },
    {
      id: 'msg-2',
      senderId: 'user',
      content: 'Hi Sarah! I\'m very interested in this property. Could you tell me more about the building amenities?',
      timestamp: '2024-12-19T10:15:00Z',
      type: 'text',
      read: true
    },
    {
      id: 'msg-3',
      senderId: 'agent-1',
      content: 'I have some additional floor plans to share with you. When would be a good time for a call?',
      timestamp: '2024-12-19T14:30:00Z',
      type: 'text',
      read: false
    }
  ],
  '2': [
    {
      id: 'msg-4',
      senderId: 'agent-2',
      content: 'Hi! I\'m Michael, representing the Victorian home on Beacon Hill. It\'s a beautiful property with lots of character.',
      timestamp: '2024-12-19T09:30:00Z',
      type: 'text',
      read: true
    },
    {
      id: 'msg-5',
      senderId: 'user',
      content: 'I love the exterior photos! Is the kitchen recently renovated?',
      timestamp: '2024-12-19T10:45:00Z',
      type: 'text',
      read: true
    },
    {
      id: 'msg-6',
      senderId: 'user',
      content: 'Thank you for the virtual tour. I\'d like to schedule an in-person viewing.',
      timestamp: '2024-12-19T11:45:00Z',
      type: 'text',
      read: true
    }
  ],
  '3': [
    {
      id: 'msg-7',
      senderId: 'agent-3',
      content: 'Welcome! This penthouse offers stunning harbor views and top-tier finishes throughout.',
      timestamp: '2024-12-18T14:00:00Z',
      type: 'text',
      read: true
    },
    {
      id: 'msg-8',
      senderId: 'user',
      content: 'The views are incredible! What\'s the HOA fee situation?',
      timestamp: '2024-12-18T15:30:00Z',
      type: 'text',
      read: true
    },
    {
      id: 'msg-9',
      senderId: 'agent-3',
      content: 'The seller is open to negotiation. Let me know if you\'d like to make an offer.',
      timestamp: '2024-12-18T16:20:00Z',
      type: 'text',
      read: true
    }
  ]
}

export default function MessagesPage() {
  const { user, role } = useAuth()
  const [conversations, setConversations] = useState<MockConversation[]>(mockConversations)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('1')
  const [messages, setMessages] = useState<Record<string, MockMessage[]>>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'archived'

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)
  const conversationMessages = selectedConversationId ? messages[selectedConversationId] || [] : []
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participants.some((p: any) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || conversation.property.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conversation.unreadCount > 0) ||
                         (filter === 'archived' && conversation.archived)
    
    return matchesSearch && matchesFilter && !conversation.archived
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 168) // Less than a week
    {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return

    const message: MockMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false
    }

    setMessages((prev: Record<string, MockMessage[]>) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), message]
    }))

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversationId
        ? { ...conv, lastMessage: message }
        : conv
    ))

    setNewMessage('')
  }

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId
        ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true } }
        : conv
    ))
  }

  const ConversationItem = ({ conversation }: { conversation: MockConversation }) => {
    const agent = conversation.participants[0]
    const isSelected = conversation.id === selectedConversationId
    const hasUnread = conversation.unreadCount > 0

    return (
      <div
        onClick={() => {
          setSelectedConversationId(conversation.id)
          if (hasUnread) markAsRead(conversation.id)
        }}
        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
          isSelected ? 'bg-emerald-50 border-r-2 border-r-emerald-500' : ''
        }`}
      >
        <div className="flex items-start space-x-3">
          {/* Avatar */}
          <div className="relative">            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
              {agent.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            {agent.online && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-sm font-medium truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                {agent.name}
              </h3>
              <div className="flex items-center space-x-2 ml-2">
                {hasUnread && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.lastMessage.timestamp)}
                </span>
              </div>
            </div>

            {/* Property */}
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Building2 className="h-3 w-3 mr-1" />
              <span className="truncate">{conversation.property.title}</span>
              <span className="mx-1">•</span>
              <span>{formatPrice(conversation.property.price)}</span>
            </div>

            {/* Last Message */}
            <p className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
              {conversation.lastMessage.senderId === 'user' ? 'You: ' : ''}
              {conversation.lastMessage.content}
            </p>

            {/* Priority Indicator */}
            {conversation.priority === 'high' && (
              <div className="mt-2">
                <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                  High Priority
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const MessageBubble = ({ message, isOwn }: { message: MockMessage, isOwn: boolean }) => {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-emerald-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm">{message.content}</p>
          <div className={`flex items-center justify-end mt-1 space-x-1 ${
            isOwn ? 'text-emerald-100' : 'text-gray-500'
          }`}>
            <span className="text-xs">{formatTime(message.timestamp)}</span>
            {isOwn && (
              message.read ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-500">
              Communicate with agents and manage your property inquiries
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>{conversations.filter(c => c.unreadCount > 0).length} unread</span>
            </div>
          </div>
        </div>

        {/* Messages Interface */}
        <div className="h-[calc(100vh-200px)] bg-white rounded-xl border border-gray-200 overflow-hidden flex">
          {/* Conversations Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1 mt-3">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'archived', label: 'Archived' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      filter === tab.key
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    {tab.label}
                    {tab.key === 'unread' && conversations.filter(c => c.unreadCount > 0).length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                        {conversations.filter(c => c.unreadCount > 0).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations</h3>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'No conversations match your search' : 'Start a conversation with an agent'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedConversation.participants[0].name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        {selectedConversation.participants[0].online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.participants[0].name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building2 className="h-3 w-3 mr-1" />
                          <span>{selectedConversation.property.title}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map((message: MockMessage) => (
                    <MessageBubble 
                      key={message.id} 
                      message={message} 
                      isOwn={message.senderId === 'user'} 
                    />
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
