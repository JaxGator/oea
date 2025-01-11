import { useState, useCallback } from "react";
import { UserFilters } from "@/components/admin/AdminUserList";
import { useDebounce } from "@/hooks/use-debounce";
import { useMemberManagement } from "./useMemberManagement";

export function useUserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    isAdmin: false,
    isApproved: false,
    isMember: false
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { data, isLoading, error, refetch } = useMemberManagement(debouncedSearch, filters, page);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
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