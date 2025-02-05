
import { useState, useCallback } from "react";
import { UserFilters } from "@/components/admin/AdminUserList";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";

const ITEMS_PER_PAGE = 10;

interface QueryResult {
  members: Member[];
  totalPages: number;
}

export function useUserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    isAdmin: false,
    isApproved: false,
    isMember: false
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, error, refetch } = useQuery<QueryResult>({
    queryKey: ['members', debouncedSearch, filters, page],
    queryFn: async () => {
      console.log('Fetching members with params:', { debouncedSearch, filters, page });
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply search filter
      if (debouncedSearch) {
        query = query.ilike('username', `%${debouncedSearch}%`);
      }

      // Apply status filters
      if (filters.isAdmin) {
        query = query.eq('is_admin', true);
      }
      if (filters.isApproved) {
        query = query.eq('is_approved', true);
      }
      if (filters.isMember) {
        query = query.eq('is_member', true);
      }

      // Add pagination
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
        members: (data || []) as Member[],
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE)
      };
    }
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    console.log('Changing to page:', newPage);
    setPage(newPage);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    page,
    filters
  };
}
