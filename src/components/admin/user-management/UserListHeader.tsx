import { CreateUserDialog } from "./CreateUserDialog";
import { BulkUserCreation } from "./BulkUserCreation";

interface UserListHeaderProps {
  onUserCreated: () => void;
}

export function UserListHeader({ onUserCreated }: UserListHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <div className="flex gap-2">
        <CreateUserDialog onUserCreated={onUserCreated} />
        <BulkUserCreation />
      </div>
    </div>
  );
}