'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudUpload as CloudUploadIcon, 
  FileText as DocumentIcon, 
  Image as PhotoIcon, 
  X as XMarkIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as ExclamationTriangleIcon 
} from 'lucide-react';
import { useFileUpload, uploadConfigs, formatFileSize, getFileIcon, UploadedFile } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  uploadType: 'property-images' | 'documents' | 'avatar';
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  className?: string;
  propertyId?: string;
  category?: string;
  disabled?: boolean;
}

const uploadTitles = {
  'property-images': {
    title: 'Property Images',
    subtitle: 'Upload high-quality images of your property',
    icon: PhotoIcon,
  },
  'documents': {
    title: 'Documents',
    subtitle: 'Upload contracts, certificates, or other documents',
    icon: DocumentIcon,
  },
  'avatar': {
    title: 'Profile Picture',
    subtitle: 'Upload your profile photo',
    icon: PhotoIcon,
  },
};

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadType,
  onFilesUploaded,
  onError,
  className = '',
  propertyId,
  category,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const config = uploadConfigs[uploadType];
  const { title, subtitle, icon: IconComponent } = uploadTitles[uploadType];
  
  const {
    uploading,
    uploadedFiles,
    errors,
    uploadFiles,
    removeFile,
    clearAll,
  } = useFileUpload({
    ...config,
    onSuccess: (files) => {
      onFilesUploaded?.(files);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && !disabled) {
      uploadFiles(files);
    }
    // Reset the input value to allow re-selecting the same file
    e.target.value = '';
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300',
          {
            'border-blue-500 bg-blue-50': dragOver && !disabled,
            'border-gray-300 hover:border-gray-400': !dragOver && !disabled,
            'border-gray-200 bg-gray-50 cursor-not-allowed': disabled,
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={!disabled ? { scale: 1.01 } : {}}
        whileTap={!disabled ? { scale: 0.99 } : {}}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={config.maxFiles > 1}
          accept={config.allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className={cn(
            'mx-auto w-16 h-16 rounded-full flex items-center justify-center',
            disabled ? 'bg-gray-200' : 'bg-gray-100'
          )}>
            <IconComponent className={cn(
              'h-8 w-8',
              disabled ? 'text-gray-400' : 'text-gray-500'
            )} />
          </div>
          
          <div>
            <h3 className={cn(
              'text-lg font-semibold',
              disabled ? 'text-gray-400' : 'text-gray-900'
            )}>
              {title}
            </h3>
            <p className={cn(
              'text-sm',
              disabled ? 'text-gray-400' : 'text-gray-600'
            )}>
              {subtitle}
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              type="button"
              onClick={handleBrowseClick}
              disabled={uploading || disabled}
              className={cn(
                'px-6 py-2',
                disabled ? 'bg-gray-300 hover:bg-gray-300' : ''
              )}
            >
              {uploading ? (
                <>
                  <motion.div
                    className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <CloudUploadIcon className="w-4 h-4 mr-2" />
                  Choose Files
                </>
              )}
            </Button>
            
            {!disabled && (
              <p className="text-xs text-gray-500">
                or drag and drop files here
              </p>
            )}
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Max file size: {formatFileSize(config.maxFileSize)}</p>
            <p>Allowed types: {config.allowedTypes.map(type => type.split('/')[1]).join(', ')}</p>
            <p>Max files: {config.maxFiles}</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Progress */}
      {uploading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm text-blue-600">Uploading files...</span>
          </div>
        </motion.div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-800">Upload errors:</p>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Uploaded Files ({uploadedFiles.length})
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear all
            </Button>
          </div>
          
          <AnimatePresence>
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="text-green-600 text-lg">
                  {getFileIcon(file.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    {file.category && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{file.category}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
