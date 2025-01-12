import { UserSearch } from "./UserSearch";
import { UserFilters } from "./UserFilters";
import { CreateUserDialog } from "./CreateUserDialog";
import { BulkUserCreation } from "./BulkUserCreation";
import type { UserFilters as UserFiltersType } from "../AdminUserList";

interface UserListHeaderProps {
  onUserCreated: () => void;
  onSearch: (term: string) => void;
  onFilterChange: (filters: UserFiltersType) => void;
  filters: UserFiltersType;
}

export function UserListHeader({ 
  onUserCreated, 
  onSearch, 
  onFilterChange,
  filters
}: UserListHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <CreateUserDialog onUserCreated={onUserCreated} />
          <BulkUserCreation />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <UserSearch 
          onSearch={onSearch}
          placeholder="Search users by username or email..."
        />
        <UserFilters 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}