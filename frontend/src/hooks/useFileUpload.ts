// File Upload Hook for Vercel Blob Integration
import { useState, useCallback } from 'react';

interface FileUploadOptions {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
  uploadEndpoint: string;
  onSuccess?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  category?: string;
}

interface UploadProgress {
  [key: string]: number;
}

interface UseFileUploadReturn {
  uploading: boolean;
  progress: UploadProgress;
  uploadedFiles: UploadedFile[];
  errors: string[];
  uploadFiles: (files: FileList | File[]) => Promise<void>;
  removeFile: (fileId: string) => void;
  clearAll: () => void;
}

export const useFileUpload = (options: FileUploadOptions): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = useCallback((file: File): string | null => {
    if (options.maxFileSize && file.size > options.maxFileSize) {
      return `File size exceeds ${options.maxFileSize / 1024 / 1024}MB limit`;
    }
    
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed`;
    }
    
    return null;
  }, [options]);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Clear previous errors
    setErrors([]);

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (options.maxFiles && validFiles.length > options.maxFiles) {
      newErrors.push(`Maximum ${options.maxFiles} files allowed`);
      setErrors(newErrors);
      return;
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      options.onError?.(newErrors.join(', '));
      return;
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = validFiles.map(file => uploadSingleFile(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedFile[];
      
      setUploadedFiles(prev => [...prev, ...successfulUploads]);
      options.onSuccess?.(successfulUploads);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setErrors(prev => [...prev, errorMessage]);
      options.onError?.(errorMessage);
    } finally {
      setUploading(false);
      setProgress({});
    }
  }, [options, validateFile]);

  const uploadSingleFile = async (file: File): Promise<UploadedFile | null> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional fields for specific upload types
    if (options.uploadEndpoint.includes('documents')) {
      formData.append('category', 'document'); // Document category
    }
    
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Get auth token from localStorage (NextAuth)
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(options.uploadEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle single file response or multiple files response
      const uploadedFile = result.file || result.files?.[0];
      
      if (!uploadedFile) {
        throw new Error('No file data returned from upload');
      }

      return {
        id: uploadedFile.id || fileId,
        name: uploadedFile.name || file.name,
        size: uploadedFile.size || file.size,
        type: uploadedFile.type || file.type,
        url: uploadedFile.url,
        uploadedAt: uploadedFile.uploadedAt || new Date().toISOString(),
        category: uploadedFile.category,
      };
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setErrors(prev => [...prev, `${file.name}: ${errorMessage}`]);
      return null;
    }
  };

  const removeFile = useCallback((fileId: string) => {
    // Remove from local state
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    
    // TODO: Call delete API endpoint
    fetch(`/api/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    }).catch(error => {
      console.error('Delete error:', error);
      // Re-add file to state if delete failed
      // setUploadedFiles(prev => [...prev, deletedFile]);
    });
  }, []);

  const clearAll = useCallback(() => {
    setUploadedFiles([]);
    setErrors([]);
    setProgress({});
  }, []);

  return {
    uploading,
    progress,
    uploadedFiles,
    errors,
    uploadFiles,
    removeFile,
    clearAll,
  };
};

// Utility function to format file sizes
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Utility function to get file icon based on type
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.startsWith('text/')) return '📝';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  return '📎';
};

// Pre-configured upload options for different file types
export const uploadConfigs = {
  'property-images': {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 10,
    uploadEndpoint: '/api/upload/property-images',
  },
  'documents': {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
    maxFiles: 5,
    uploadEndpoint: '/api/upload/documents',
  },
  'avatar': {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 1,
    uploadEndpoint: '/api/upload/avatar',
  },
};
