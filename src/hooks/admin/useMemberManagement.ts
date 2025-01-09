import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { UserFilters } from "@/components/admin/AdminUserList";
import { useToast } from "@/hooks/use-toast";

interface MemberQueryResult {
  members: Member[];
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export function useMemberManagement(searchTerm: string = "", filters: UserFilters = {}, page: number = 1) {
  const { toast } = useToast();

  return useQuery<MemberQueryResult, Error>({
    queryKey: ['members', searchTerm, filters, page],
    queryFn: async () => {
      try {
        console.log('Fetching members with params:', { searchTerm, filters, page });
        
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        // Apply search filter
        if (searchTerm) {
          query = query.ilike('username', `%${searchTerm}%`);
        }

        // Only apply filters that are explicitly set to true
        // If no filters are selected, show all users
        const activeFilters = Object.entries(filters).filter(([_, value]) => value === true);
        
        if (activeFilters.length > 0) {
          // Build filter conditions
          activeFilters.forEach(([key, value]) => {
            if (value === true) {
              query = query.eq(key, true);
            }
          });
        }

        // Add pagination
        const start = (page - 1) * ITEMS_PER_PAGE;
        query = query
          .range(start, start + ITEMS_PER_PAGE - 1)
          .order('username');

        const { data, error, count } = await query;
        
        if (error) {
          console.error('Error fetching members:', error);
          throw new Error(`Failed to fetch members: ${error.message}`);
        }

        if (!data) {
          console.warn('No data returned from query');
          return {
            members: [],
            totalPages: 0
          };
        }

        console.log('Members fetch result:', {
          count,
          dataLength: data.length,
          page,
          filters: activeFilters
        });

        return {
          members: data as Member[],
          totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
        };
      } catch (error) {
        console.error('Unexpected error in useMemberManagement:', error);
        toast({
          title: "Error",
          description: "Failed to load members. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}