import { useState, useCallback, useRef } from "react";
import { UserFilters } from "@/components/admin/AdminUserList";
import { useDebounce } from "@/hooks/use-debounce";
import { useMemberManagement } from "./useMemberManagement";

export function useUserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>({});
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { data, isLoading, error, refetch } = useMemberManagement(debouncedSearch, filters, page);

  const handleSearch = useCallback((term: string) => {
    console.log('Search term changed:', term);
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: UserFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    console.log('Changing page to:', newPage);
    setPage(newPage);
  }, []);

  return {
    searchTerm,
    filters,
    page,
    data,
    isLoading,
    error,
    refetch,
    handleSearch,
    handleFilterChange,
    handlePageChange
  };
}