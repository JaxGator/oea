import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateUserDialog } from "./CreateUserDialog";
import { BulkUserCreation } from "./BulkUserCreation";
import { Search } from "lucide-react";

interface UserListHeaderProps {
  onUserCreated: () => void;
  onSearch: (term: string) => void;
}

export function UserListHeader({ onUserCreated, onSearch }: UserListHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
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
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by username or email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}