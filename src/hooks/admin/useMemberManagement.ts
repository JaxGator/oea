import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";

export function useMemberManagement(searchTerm: string = "") {
  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['members', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return data as Member[];
    },
  });

  return {
    members,
    isLoading,
    error,
    refetch,
  };
}