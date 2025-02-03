import { Button } from "@/components/ui/button";
import { UserSearch } from "./UserSearch";
import { UserFilters } from "./UserFilters";
import { CreateUserDialog } from "./CreateUserDialog";
import { UserFilters as UserFiltersType } from "../AdminUserList";

interface UserListHeaderProps {
  onSearch: (term: string) => void;
  filters: UserFiltersType;
  onFilterChange: (filters: UserFiltersType) => void;
  onUserCreated: () => void;
}

export function UserListHeader({
  onSearch,
  filters,
  onFilterChange,
  onUserCreated
}: UserListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <UserSearch onSearch={onSearch} />
        <CreateUserDialog onUserCreated={onUserCreated} />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <UserFilters
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}