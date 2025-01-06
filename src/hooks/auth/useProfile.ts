import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/auth";

export function useProfile(userId: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
          throw error;
        }
        
        return data as Profile | null;
      } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}