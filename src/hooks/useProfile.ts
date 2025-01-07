import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleQueryResult } from '@/utils/supabase-helpers';
import type { Profile } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log('Fetching profile for user:', userId);
      
      const result = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (result.error) {
        console.error('Profile fetch error:', {
          error: result.error,
          userId,
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Error loading profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        
        throw result.error;
      }
      
      console.log('Profile fetch result:', result.data);
      return result.data as Profile;
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000)
  });
}