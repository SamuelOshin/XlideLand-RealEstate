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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadDeferredProps {
  uploadType: 'property-images' | 'documents' | 'avatar';
  onFilesSelected?: (files: File[]) => void;
  onFileRemoved?: (index: number) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  selectedFiles?: File[];
}

const uploadTitles = {
  'property-images': {
    title: 'Property Images',
    subtitle: 'Select high-quality images of your property (will upload when form is submitted)',
    icon: PhotoIcon,
  },
  'documents': {
    title: 'Documents',
    subtitle: 'Select contracts, certificates, or other documents (will upload when form is submitted)',
    icon: DocumentIcon,
  },
  'avatar': {
    title: 'Profile Picture',
    subtitle: 'Select your profile photo (will upload when form is submitted)',
    icon: PhotoIcon,
  },
};

// Default configurations
const defaultConfigs = {
  'property-images': {
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  'documents': {
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'text/plain'],
  },
  'avatar': {
    maxFiles: 1,
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

export const FileUploadDeferred: React.FC<FileUploadDeferredProps> = ({
  uploadType,
  onFilesSelected,
  onFileRemoved,
  onError,
  className = '',
  disabled = false,
  maxFiles,
  maxFileSize,
  allowedTypes,
  selectedFiles = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const config = defaultConfigs[uploadType];
  const { title, subtitle, icon: IconComponent } = uploadTitles[uploadType];
  
  const finalMaxFiles = maxFiles || config.maxFiles;
  const finalMaxFileSize = maxFileSize || config.maxFileSize;
  const finalAllowedTypes = allowedTypes || config.allowedTypes;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > finalMaxFileSize) {
      return `File size exceeds ${formatFileSize(finalMaxFileSize)} limit`;
    }
    
    if (!finalAllowedTypes.includes(file.type)) {
      return `File type ${file.type} not allowed`;
    }
    
    return null;
  };

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
      handleFileSelection(Array.from(files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && !disabled) {
      handleFileSelection(Array.from(files));
    }
    // Reset the input value to allow re-selecting the same file
    e.target.value = '';
  };

  const handleFileSelection = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Clear previous errors
    setErrors([]);

    // Check if adding new files would exceed the limit
    if (selectedFiles.length + newFiles.length > finalMaxFiles) {
      newErrors.push(`Maximum ${finalMaxFiles} files allowed. You currently have ${selectedFiles.length} files.`);
    } else {
      // Validate each file
      newFiles.forEach(file => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      onError?.(newErrors.join(', '));
    }

    if (validFiles.length > 0) {
      onFilesSelected?.(validFiles);
    }
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    onFileRemoved?.(index);
  };

  const handleClearAll = () => {
    // Remove all files by calling onFileRemoved for each file in reverse order
    for (let i = selectedFiles.length - 1; i >= 0; i--) {
      onFileRemoved?.(i);
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
          multiple={finalMaxFiles > 1}
          accept={finalAllowedTypes.join(',')}
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
              disabled={disabled}
              className={cn(
                'px-6 py-2',
                disabled ? 'bg-gray-300 hover:bg-gray-300' : ''
              )}
            >
              <CloudUploadIcon className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            
            {!disabled && (
              <p className="text-xs text-gray-500">
                or drag and drop files here
              </p>
            )}
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Max file size: {formatFileSize(finalMaxFileSize)}</p>
            <p>Allowed types: {finalAllowedTypes.map(type => type.split('/')[1]).join(', ')}</p>
            <p>Max files: {finalMaxFiles}</p>
          </div>
        </div>
      </motion.div>

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
              <p className="text-sm font-medium text-red-800">File selection errors:</p>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({selectedFiles.length})
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear all
            </Button>
          </div>
          
          <AnimatePresence>
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="text-blue-600 text-lg">
                  {file.type.startsWith('image/') ? '🖼️' : '📄'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>Ready to upload</span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
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

export default FileUploadDeferred;
