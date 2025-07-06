'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { documentsAPI } from '@/lib/api'
import { Document } from '@/types'
import { redirectToAuth } from '@/lib/auth-utils'
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
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export default function DocumentsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [uploading, setUploading] = useState(false)
  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuth(router)
      return
    }
    loadDocuments()
  }, [isAuthenticated, router])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      const documentsData = await documentsAPI.getDocuments()
      setDocuments(documentsData)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to load documents')
      console.error('Documents loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDocument = async (documentId: number) => {
    try {
      await documentsAPI.deleteDocument(documentId)
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      toast.success('Document deleted successfully')
    } catch (err) {
      console.error('Delete document error:', err)
      toast.error('Failed to delete document')
    }
  }
  const downloadDocument = async (document: Document) => {
    try {
      if (document.file_url || document.file) {
        window.open(document.file_url || document.file, '_blank')
      } else {
        toast.error('File URL not available')
      }
    } catch (err) {
      console.error('Download document error:', err)
      toast.error('Failed to download document')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      await documentsAPI.uploadDocument(file, file.name, 'other', file.name)
      toast.success('Document uploaded successfully')
      loadDocuments() // Reload documents after upload
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  const getDocumentIcon = (documentType: string) => {
    switch (documentType) {
      case 'contract':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'deed':
        return <Building2 className="w-5 h-5 text-green-600" />
      case 'inspection':
        return <CheckCircle className="w-5 h-5 text-purple-600" />
      case 'insurance':
        return <Archive className="w-5 h-5 text-orange-600" />
      case 'mortgage':
        return <FileIcon className="w-5 h-5 text-red-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const filteredDocuments = documents
    .filter(document => {
      if (!searchQuery) return true
      const searchLower = searchQuery.toLowerCase()
      return (
        (document.title || document.name).toLowerCase().includes(searchLower) ||
        document.document_type.toLowerCase().includes(searchLower)
      )
    })
    .filter(document => {
      if (filterType === 'all') return true
      return document.document_type === filterType
    })

  const documentTypes = ['all', 'contract', 'deed', 'inspection', 'insurance', 'mortgage', 'other']

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Documents</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDocuments}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600">Manage your property documents and contracts</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={uploading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload Document
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Documents ({filteredDocuments.length})
              </h2>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Upload your first document to get started.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {getDocumentIcon(document.document_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {document.title || document.name}
                            </h3>
                            {getStatusBadge(document.status || 'active')}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Type: {document.document_type.charAt(0).toUpperCase() + document.document_type.slice(1)}
                          </p>                          {document.listing && (
                            <p className="text-sm text-gray-600 mb-2">
                              Property: {document.listing}
                            </p>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            Uploaded {new Date(document.uploaded_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => downloadDocument(document)}
                          className="text-emerald-600 hover:text-emerald-700 p-1"
                          title="Download document"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDocument(document.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
