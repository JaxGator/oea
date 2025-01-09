import { useCallback } from "react";
import { Member } from "@/components/members/types";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberHandler } from "./user-management/EditMemberHandler";
import { useSessionCheck } from "@/hooks/auth/useSessionCheck";
import { UserListHeader } from "./user-management/UserListHeader";
import { UserListContent } from "./user-management/UserListContent";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { useViewMemberDialog } from "@/hooks/admin/useViewMemberDialog";
import { UserListError } from "./user-management/UserListError";
import { useUserList } from "@/hooks/admin/useUserList";
import { Skeleton } from "@/components/ui/skeleton";

export type UserFilters = {
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
};

export default function AdminUserList() {
  const { notify } = useNotifications();
  const {
    data,
    isLoading,
    error,
    refetch,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    page,
    filters
  } = useUserList();
  
  const {
    editingMember,
    handleEditMember,
    handleCloseEdit,
    handleDeleteMember,
    handleUpdateComplete,
  } = useUserManagement(refetch);

  const {
    viewingMember,
    isViewDialogOpen,
    handleViewMember,
    handleCloseView
  } = useViewMemberDialog();

  useSessionCheck();

  const handleEdit = useCallback((member: Member) => {
    if (!member?.id || !member?.username) {
      console.error('Invalid member data for edit:', member);
      notify("error", "Invalid Data", "Member data is incomplete. Please try again.");
      return;
    }
    console.log('Handling edit for member:', member);
    handleEditMember(member);
  }, [handleEditMember, notify]);

  if (error) {
    console.error('Error fetching members:', error);
    return <UserListError onRetry={refetch} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UserListHeader 
        onUserCreated={refetch}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
      
      <UserListContent
        members={data?.members ?? []}
        isLoading={isLoading}
        error={error}
        onEditMember={handleEdit}
        onDeleteMember={handleDeleteMember}
        onViewMember={handleViewMember}
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />

      {viewingMember && (
        <ViewMemberDialog
          member={viewingMember}
          open={isViewDialogOpen}
          onOpenChange={() => handleCloseView()}
        />
      )}

      {editingMember && (
        <EditMemberHandler
          member={editingMember}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateComplete}
        />
      )}
    </div>
  );
}