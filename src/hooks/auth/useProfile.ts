import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        console.log('No userId provided to useProfile hook');
        return null;
      }
      
      console.log('Fetching profile for user:', userId);
      
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          console.log('No active session found');
          return null;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Profile fetch error:', {
            error,
            userId,
            status: error.code,
            message: error.message,
            timestamp: new Date().toISOString()
          });
          
          if (error.message.includes('JWT expired')) {
            await supabase.auth.refreshSession();
            toast({
              title: "Session expired",
              description: "Please sign in again",
              variant: "destructive",
            });
            return null;
          }
          
          toast({
            title: "Error loading profile",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          
          throw error;
        }
        
        console.log('Profile fetch result:', data);
        return data as Profile;
      } catch (error) {
        console.error('Profile fetch failed:', {
          error,
          userId,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
  });
}