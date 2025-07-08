import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarData {
  avatar_url: string | null;
  has_avatar: boolean;
  uploaded_at?: string;
  file_size?: number;
}

export function useUserAvatar() {
  const [avatar, setAvatar] = useState<AvatarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAvatar = async () => {
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

      const response = await fetch('/api/user/avatar', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch avatar');
      }

      const data = await response.json();
      setAvatar(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching avatar:', err);
      
      // Set default state on error
      setAvatar({
        avatar_url: null,
        has_avatar: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [user?.id]); // Re-fetch when user changes

  return { 
    avatar, 
    loading, 
    error, 
    refetch: fetchAvatar,
    hasAvatar: avatar?.has_avatar || false,
    avatarUrl: avatar?.avatar_url
  };
}
