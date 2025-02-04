
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMemberQueries(userId: string | undefined) {
  const { toast } = useToast();

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        console.log('Fetching profile for user:', userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', {
            error,
            userId,
            timestamp: new Date().toISOString()
          });
          throw error;
        }
        
        console.log('Profile fetch result:', data);
        return data;
      } catch (error) {
        console.error('Profile query error:', error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!userId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000)
  });

  const membersQuery = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      try {
        console.log('Fetching all members...');
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('username');
        
        if (error) {
          console.error('Error fetching members:', {
            error,
            timestamp: new Date().toISOString()
          });
          throw error;
        }

        console.log('Members fetch result:', data);
        return data || [];
      } catch (error) {
        console.error('Members query error:', error);
        toast({
          title: "Error",
          description: "Failed to load members. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    profileQuery,
    membersQuery
  };
}
