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
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <UserSearch onSearch={onSearch} />
        </div>
        <div className="flex justify-end">
          <CreateUserDialog onUserCreated={onUserCreated} />
        </div>
      </div>
      
      <div className="w-full">
        <UserFilters
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}