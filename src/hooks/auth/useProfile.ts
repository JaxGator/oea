
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export function useProfile(userId: string | undefined) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        console.log('No userId provided to useProfile hook');
        return null;
      }
      
      try {
        // First check if we have an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          // Only show toast for non-network errors to avoid spamming
          if (!sessionError.message.includes('NetworkError')) {
            toast({
              title: "Session Error",
              description: "Please try signing in again",
              variant: "destructive",
            });
          }
          throw sessionError;
        }
        
        if (!session) {
          console.log('No active session found');
          return null;
        }

        // Use proper Supabase query builder syntax with error handling
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
          
          // Handle JWT expiration with automatic refresh
          if (error.message.includes('JWT expired')) {
            console.log('JWT expired, attempting refresh...');
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error('Session refresh failed:', refreshError);
              toast({
                title: "Session expired",
                description: "Please sign in again",
                variant: "destructive",
              });
              await supabase.auth.signOut();
              return null;
            }
            
            // Retry the query after refresh
            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();
            
            if (retryError) {
              console.error('Profile retry error:', retryError);
              throw retryError;
            }
            
            return retryData as Profile;
          }
          
          // Only show toast for server errors, not network issues
          if (!error.message.includes('NetworkError')) {
            toast({
              title: "Error loading profile",
              description: "Please try refreshing the page",
              variant: "destructive",
            });
          }
          
          throw error;
        }
        
        if (!data) {
          console.log('No profile found for user:', userId);
          return null;
        }
        
        console.log('Profile fetch successful:', data);
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
    retry: (failureCount, error) => {
      // Don't retry on auth errors or if profile doesn't exist
      if (error?.message?.includes('JWT expired') || error?.code === '404') {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000), // Exponential backoff
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
  });
}
