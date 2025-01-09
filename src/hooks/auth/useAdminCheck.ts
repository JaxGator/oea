import { useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { toast } from '@/hooks/use-toast';

export function useAdminCheck() {
  const { profile, isLoading, error } = useAuthState();

  useEffect(() => {
    console.log('useAdminCheck - Profile state:', {
      hasProfile: !!profile,
      isAdmin: profile?.is_admin,
      userId: profile?.id,
      timestamp: new Date().toISOString()
    });
  }, [profile]);

  return {
    isAdmin: profile?.is_admin ?? false,
    isLoading,
    error,
    profile
  };
}