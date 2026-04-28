
import { useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from 'sonner';

export function useAdminCheck() {
  const { profile, isLoading, error } = useAuthState();

  useEffect(() => {
    // Detailed logging of profile state

    // Log any errors that might prevent admin access
    if (error) {
      console.error('useAdminCheck - Error fetching profile:', {
        error,
        timestamp: new Date().toISOString()
      });
    }
  }, [profile, error]);

  return {
    isAdmin: profile?.is_admin ?? false,
    isLoading,
    error,
    profile
  };
}
