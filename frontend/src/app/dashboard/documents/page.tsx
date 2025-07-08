'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { redirectToAuth } from '@/lib/auth-utils'
import { useUserFiles } from '@/hooks/useUserFiles'
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
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import FileUpload from '@/components/ui/FileUpload'
import { UploadedFile } from '@/hooks/useFileUpload'

export default function DocumentsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  // Use the useUserFiles hook to fetch documents
  // Temporarily fetch files from both 'document' and 'general' categories
  // to handle files uploaded before the category fix
  const { 
    files: documentFiles, 
    loading: documentsLoading, 
    error: documentsError, 
    refetch: reloadDocuments 
  } = useUserFiles({ 
    category: 'document',
    autoFetch: true 
  })

  const { 
    files: generalFiles, 
    loading: generalLoading, 
    error: generalError 
  } = useUserFiles({ 
    category: 'general',
    autoFetch: true 
  })

  // Combine both sets of files and filter for document-like files
  const documents = [
    ...documentFiles,
    ...generalFiles.filter(file => 
      // Include files that look like documents based on file type
      ['pdf', 'doc', 'docx', 'txt'].includes(file.file_type.toLowerCase()) ||
      file.mime_type.includes('pdf') ||
      file.mime_type.includes('document') ||
      file.mime_type.includes('text')
    )
  ];

  const loading = documentsLoading || generalLoading;
  const error = documentsError || generalError;

  // Combined reload function
  const reloadAllDocuments = () => {
    reloadDocuments();
    // We would need to add a refetch for generalFiles too, but for now this should work
  };
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuth(router)
      return
    }
    // Documents will be loaded automatically by useUserFiles hook
  }, [isAuthenticated, router])

  const deleteDocument = async (documentId: string) => {
    try {
      // Delete file via the files API
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`/api/files/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      toast.success('Document deleted successfully')
      reloadAllDocuments() // Refresh the documents list
    } catch (err) {
      console.error('Delete document error:', err)
      toast.error('Failed to delete document')
    }
  }
  
  const downloadDocument = async (document: any) => {
    try {
      if (document.blob_url) {
        window.open(document.blob_url, '_blank')
      } else {
        toast.error('File URL not available')
      }
    } catch (err) {
      console.error('Download document error:', err)
      toast.error('Failed to download document')
    }
  }

  const handleFilesUploaded = async (files: UploadedFile[]) => {
    toast.success(`Successfully uploaded ${files.length} document(s)`)
    reloadAllDocuments() // Reload documents after upload
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
    toast.error(`Failed to upload document: ${error}`)
  }

  const getDocumentIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'txt':
        return <FileText className="w-5 h-5 text-gray-600" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-5 h-5 text-green-600" />
      default:
        return <File className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Active</Badge>
    }
  }

  const filteredDocuments = documents
    .filter(document => {
      if (!searchQuery) return true
      const searchLower = searchQuery.toLowerCase()
      return (
        document.file_name.toLowerCase().includes(searchLower) ||
        document.original_name.toLowerCase().includes(searchLower) ||
        document.file_type.toLowerCase().includes(searchLower)
      )
    })
    .filter(document => {
      if (filterType === 'all') return true
      return document.file_type === filterType
    })

  const documentTypes = ['all', 'pdf', 'doc', 'docx', 'txt', 'jpg', 'png', 'other']

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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Documents</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={reloadAllDocuments}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600">Manage your property documents and files</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileUpload
              uploadType="documents"
              onFilesUploaded={handleFilesUploaded}
              onError={handleUploadError}
              className="bg-emerald-100 hover:bg-emerald-200 text-white"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents by name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {documentTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Upload your first document to get started.'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <FileUpload
                uploadType="documents"
                onFilesUploaded={handleFilesUploaded}
                onError={handleUploadError}
                className="bg-emerald-100 hover:bg-emerald-700 text-white"
              />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="font-semibold text-gray-900">
                    {filteredDocuments.length} Document{filteredDocuments.length !== 1 ? 's' : ''}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reloadAllDocuments}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {getDocumentIcon(document.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {document.original_name || document.file_name}
                          </h3>
                          {getStatusBadge(document.upload_status || 'active')}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Type: {document.file_type.charAt(0).toUpperCase() + document.file_type.slice(1)}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Size: {(document.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
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
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
