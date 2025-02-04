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
      <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <UserSearch onSearch={onSearch} />
        </div>
        <div className="flex justify-end">
          <CreateUserDialog onUserCreated={onUserCreated} />
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-4 px-4 sm:overflow-visible sm:px-0">
        <UserFilters
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}