import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";

export function useMemberManagement() {
  const { toast } = useToast();

  const { 
    data: members, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      console.log('Fetching members...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to fetch members: " + error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log('Members fetched successfully:', data?.length || 0, 'members');
      return data as Member[];
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    members,
    isLoading,
    error,
    refetch
  };
}