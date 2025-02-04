import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface UserSearchProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function UserSearch({ onSearch, placeholder = "Search members..." }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce((value: string) => {
    onSearch(value);
  }, 300);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8 w-full"
      />
    </div>
  );
}