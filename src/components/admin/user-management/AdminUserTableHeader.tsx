import { Users } from "lucide-react";

export function AdminUserTableHeader() {
  return (
    <div 
      className="flex items-center gap-2 mb-4 p-4"
      role="heading"
      aria-level={2}
    >
      <Users className="h-5 w-5" aria-hidden="true" />
      <h2 className="text-xl font-semibold">User Management</h2>
    </div>
  );
}