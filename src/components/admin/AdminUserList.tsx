import { useSessionCheck } from "@/hooks/auth/useSessionCheck";
import { AdminErrorBoundary } from "./error/AdminErrorBoundary";
import { UserListContainer } from "./user-management/UserListContainer";

export type UserFilters = {
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
};

export default function AdminUserList() {
  useSessionCheck();

  return (
    <AdminErrorBoundary>
      <UserListContainer />
    </AdminErrorBoundary>
  );
}