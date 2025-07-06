'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Share2,
  Trash2,
  FileIcon,
  Image,
  File,
  Calendar,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  FolderOpen,
  Archive,
  Lock,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'

interface Document {
  id: string
  name: string
  type: 'contract' | 'deed' | 'inspection' | 'insurance' | 'mortgage' | 'other'
  fileType: 'pdf' | 'doc' | 'image' | 'other'
  size: number
  uploadedAt: string
  status: 'pending' | 'signed' | 'completed' | 'expired'
  propertyId?: string
  propertyTitle?: string
  sharedWith: string[]
  isPrivate: boolean
  url: string
  thumbnailUrl?: string
}

interface DocumentFolder {
  id: string
  name: string
  count: number
  type: string
}

export default function DocumentsPage() {
  const { user, role } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  useEffect(() => {
    loadDocuments()
    loadFolders()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    // Mock data - replace with API call
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Purchase Agreement - Downtown Penthouse',
        type: 'contract',
        fileType: 'pdf',
        size: 2548736,
        uploadedAt: '2024-01-15T10:30:00Z',
        status: 'pending',
        propertyId: '1',
        propertyTitle: 'Luxury Penthouse Downtown',
        sharedWith: ['realtor@example.com', 'lawyer@example.com'],
        isPrivate: false,
        url: '/documents/purchase-agreement-1.pdf',
        thumbnailUrl: '/api/placeholder/200/250'
      },
      {
        id: '2',
        name: 'Home Inspection Report',
        type: 'inspection',
        fileType: 'pdf',
        size: 1024000,
        uploadedAt: '2024-01-14T15:20:00Z',
        status: 'completed',
        propertyId: '1',
        propertyTitle: 'Luxury Penthouse Downtown',
        sharedWith: [],
        isPrivate: true,
        url: '/documents/inspection-report-1.pdf',
        thumbnailUrl: '/api/placeholder/200/250'
      },
      {
        id: '3',
        name: 'Property Deed',
        type: 'deed',
        fileType: 'pdf',
        size: 512000,
        uploadedAt: '2024-01-12T09:15:00Z',
        status: 'completed',
        propertyId: '2',
        propertyTitle: 'Modern Family Home',
        sharedWith: ['lawyer@example.com'],
        isPrivate: false,
        url: '/documents/property-deed-2.pdf'
      },
      {
        id: '4',
        name: 'Insurance Policy',
        type: 'insurance',
        fileType: 'pdf',
        size: 768000,
        uploadedAt: '2024-01-10T14:30:00Z',
        status: 'signed',
        propertyId: '2',
        propertyTitle: 'Modern Family Home',
        sharedWith: ['insurance@example.com'],
        isPrivate: false,
        url: '/documents/insurance-policy-2.pdf'
      },
      {
        id: '5',
        name: 'Mortgage Pre-approval Letter',
        type: 'mortgage',
        fileType: 'pdf',
        size: 256000,
        uploadedAt: '2024-01-08T11:45:00Z',
        status: 'completed',
        sharedWith: ['bank@example.com', 'realtor@example.com'],
        isPrivate: false,
        url: '/documents/mortgage-preapproval.pdf'
      },
      {
        id: '6',
        name: 'Property Photos',
        type: 'other',
        fileType: 'image',
        size: 3072000,
        uploadedAt: '2024-01-05T16:20:00Z',
        status: 'completed',
        propertyId: '1',
        propertyTitle: 'Luxury Penthouse Downtown',
        sharedWith: [],
        isPrivate: true,
        url: '/documents/property-photos.zip',
        thumbnailUrl: '/api/placeholder/200/250'
      }
    ]
    setDocuments(mockDocuments)
    setTimeout(() => setLoading(false), 1000)
  }

  const loadFolders = async () => {
    // Mock data - replace with API call
    const mockFolders: DocumentFolder[] = [
      { id: 'contracts', name: 'Contracts', count: 3, type: 'contract' },
      { id: 'inspections', name: 'Inspections', count: 2, type: 'inspection' },
      { id: 'deeds', name: 'Deeds', count: 1, type: 'deed' },
      { id: 'insurance', name: 'Insurance', count: 2, type: 'insurance' },
      { id: 'mortgage', name: 'Mortgage', count: 1, type: 'mortgage' },
      { id: 'other', name: 'Other', count: 1, type: 'other' }
    ]
    setFolders(mockFolders)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      // Handle file upload logic here
      toast.success(`${files.length} file(s) uploaded successfully`)
    }
  }

  const downloadDocument = (doc: Document) => {
    // Handle download logic here
    toast.success(`Downloading ${doc.name}`)
  }

  const shareDocument = (doc: Document) => {
    // Handle share logic here
    toast.success(`Share link copied for ${doc.name}`)
  }

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId))
    toast.success('Document deleted successfully')
  }

  const selectDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const getFileIcon = (fileType: string, type: string) => {
    if (fileType === 'image') return <Image className="w-8 h-8 text-blue-600" />
    if (fileType === 'pdf') return <FileText className="w-8 h-8 text-red-600" />
    if (type === 'contract') return <FileText className="w-8 h-8 text-green-600" />
    return <File className="w-8 h-8 text-gray-600" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'signed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    const matchesFolder = selectedFolder === 'all' || doc.type === selectedFolder
    return matchesSearch && matchesType && matchesStatus && matchesFolder
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
                <p className="text-gray-600 mt-2">
                  Organize, store, and share your real estate documents securely
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Documents
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Folders */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Folders</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedFolder('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedFolder === 'all'
                        ? 'bg-emerald-100 text-emerald-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4 inline mr-2" />
                    All Documents ({documents.length})
                  </button>
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.type)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedFolder === folder.type
                          ? 'bg-emerald-100 text-emerald-700 font-medium'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FolderOpen className="w-4 h-4 inline mr-2" />
                      {folder.name} ({folder.count})
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Documents</span>
                      <span className="font-medium">{documents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-medium text-yellow-600">
                        {documents.filter(d => d.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-medium text-green-600">
                        {documents.filter(d => d.status === 'completed').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Filters and Search */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Types</option>
                      <option value="contract">Contracts</option>
                      <option value="inspection">Inspections</option>
                      <option value="deed">Deeds</option>
                      <option value="insurance">Insurance</option>
                      <option value="mortgage">Mortgage</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="signed">Signed</option>
                      <option value="completed">Completed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  {selectedDocuments.length > 0 && (
                    <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-700">
                          {selectedDocuments.length} document(s) selected
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Documents List */}
                <div className="p-6">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                      <p className="text-gray-600 mb-4">
                        {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                          ? 'Try adjusting your search or filter criteria'
                          : 'Upload your first document to get started'
                        }
                      </p>
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(doc.id)}
                                onChange={() => selectDocument(doc.id)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                              />
                              <div className="flex-shrink-0">
                                {doc.thumbnailUrl ? (
                                  <img
                                    src={doc.thumbnailUrl}
                                    alt={doc.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                ) : (
                                  getFileIcon(doc.fileType, doc.type)
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {doc.name}
                                  </h4>
                                  <Badge className={getStatusColor(doc.status)}>
                                    {doc.status}
                                  </Badge>
                                  {doc.isPrivate && (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                {doc.propertyTitle && (
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    {doc.propertyTitle}
                                  </p>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                  <span>{formatFileSize(doc.size)}</span>
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(doc.uploadedAt).toLocaleDateString()}
                                  </span>
                                  {doc.sharedWith.length > 0 && (
                                    <span className="flex items-center">
                                      <User className="w-3 h-3 mr-1" />
                                      Shared with {doc.sharedWith.length}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadDocument(doc)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => shareDocument(doc)}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteDocument(doc.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
