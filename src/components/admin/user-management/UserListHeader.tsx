import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateUserDialog } from "./CreateUserDialog";
import { BulkUserCreation } from "./BulkUserCreation";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserFilters } from "../AdminUserList";
import { Label } from "@/components/ui/label";

interface UserListHeaderProps {
  onUserCreated: () => void;
  onSearch: (term: string) => void;
  onFilterChange: (filters: UserFilters) => void;
  filters: UserFilters;
}

export function UserListHeader({ 
  onUserCreated, 
  onSearch, 
  onFilterChange,
  filters 
}: UserListHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key: keyof UserFilters) => {
    const newFilters = {
      ...filters,
      [key]: !filters[key]
    };
    onFilterChange(newFilters);
  };

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
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by username or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="admin-filter"
              checked={filters.isAdmin}
              onCheckedChange={() => handleFilterChange('isAdmin')}
            />
            <Label htmlFor="admin-filter">Admins</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="approved-filter"
              checked={filters.isApproved}
              onCheckedChange={() => handleFilterChange('isApproved')}
            />
            <Label htmlFor="approved-filter">Approved</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="member-filter"
              checked={filters.isMember}
              onCheckedChange={() => handleFilterChange('isMember')}
            />
            <Label htmlFor="member-filter">Members</Label>
          </div>
        </div>
      </div>
    </div>
  );
}