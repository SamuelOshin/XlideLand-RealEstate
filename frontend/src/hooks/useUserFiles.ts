import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface FileData {
  id: string;
  file_name: string;
  original_name: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  blob_url: string;
  blob_key: string;
  upload_status: string;
  category: string;
  uploaded_at: string;
}

interface UseUserFilesOptions {
  fileType?: string;
  category?: string;
  autoFetch?: boolean;
}

export function useUserFiles(options: UseUserFilesOptions = {}) {
  const { fileType, category, autoFetch = true } = options;
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  const fetchFiles = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (fileType) params.append('file_type', fileType);
      if (category) params.append('category', category);
      
      const queryString = params.toString();
      const url = `/api/user/files${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files || []);
      setCount(data.count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching user files:', err);
      setFiles([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchFiles();
    }
  }, [user?.id, fileType, category, autoFetch]);

  return { 
    files, 
    loading, 
    error, 
    count,
    refetch: fetchFiles,
    isEmpty: files.length === 0
  };
}
