import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { UserFilters } from "@/components/admin/AdminUserList";

const ITEMS_PER_PAGE = 10;

export function useMemberManagement(searchTerm: string = "", filters: UserFilters = {}, page: number = 1) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['members', searchTerm, filters, page],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      // Apply role filters
      if (filters.isAdmin !== undefined) {
        query = query.eq('is_admin', filters.isAdmin);
      }
      if (filters.isApproved !== undefined) {
        query = query.eq('is_approved', filters.isApproved);
      }
      if (filters.isMember !== undefined) {
        query = query.eq('is_member', filters.isMember);
      }

      // Apply pagination
      const start = (page - 1) * ITEMS_PER_PAGE;
      query = query
        .range(start, start + ITEMS_PER_PAGE - 1)
        .order('username');

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return {
        members: data as Member[],
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
      };
    },
  });

  return {
    members: data?.members || [],
    totalPages: data?.totalPages || 1,
    isLoading,
    error,
    refetch,
  };
}