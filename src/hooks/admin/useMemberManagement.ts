import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { UserFilters } from "@/components/admin/AdminUserList";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

export function useMemberManagement(searchTerm: string = "", filters: UserFilters = {}, page: number = 1) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['members', searchTerm, filters, page],
    queryFn: async () => {
      try {
        console.log('Fetching members with params:', { searchTerm, filters, page });
        
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
          console.error('Error fetching members:', {
            error,
            params: { searchTerm, filters, page },
            timestamp: new Date().toISOString()
          });
          
          toast({
            title: "Error",
            description: "Failed to load members. Please try again.",
            variant: "destructive",
          });
          
          throw error;
        }

        console.log('Members fetch successful:', {
          count,
          results: data?.length,
          page,
          timestamp: new Date().toISOString()
        });

        return {
          members: data as Member[],
          totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
        };
      } catch (error) {
        console.error('Unexpected error in useMemberManagement:', error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}