import { Member } from "@/components/members/types";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberHandler } from "./EditMemberHandler";
import { UserListHeader } from "./UserListHeader";
import { UserListContent } from "./UserListContent";
import { UserListError } from "./UserListError";
import { useUserList } from "@/hooks/admin/useUserList";
import { useUserActions } from "@/hooks/admin/useUserActions";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { useViewMemberDialog } from "@/hooks/admin/useViewMemberDialog";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { useCallback } from "react";

export function UserListContainer() {
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
    handleUpdateComplete,
  } = useUserManagement(refetch);

  const {
    viewingMember,
    isViewDialogOpen,
    handleViewMember,
    handleCloseView
  } = useViewMemberDialog();

  const { handleDeleteUser } = useUserActions(refetch);

  const memoizedHandleEdit = useCallback((member: Member) => {
    if (!member?.id || !member?.username) {
      notify("error", "Invalid Data", "Member data is incomplete. Please try again.");
      return;
    }
    console.log('UserListContainer: Handling edit for member:', member);
    handleEditMember(member);
  }, [handleEditMember, notify]);

  const handleRefresh = useCallback(async () => {
    console.log('UserListContainer: Refreshing user list');
    await refetch();
    console.log('UserListContainer: User list refreshed');
  }, [refetch]);

  if (error) {
    return <UserListError onRetry={refetch} />;
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
        onEditMember={memoizedHandleEdit}
        onDeleteMember={handleDeleteUser}
        onViewMember={handleViewMember}
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={handlePageChange}
      />

      {viewingMember && (
        <ViewMemberDialog
          member={viewingMember}
          open={isViewDialogOpen}
          onOpenChange={handleCloseView}
        />
      )}

      {editingMember && (
        <EditMemberHandler
          member={editingMember}
          onClose={handleCloseEdit}
          onUpdate={handleRefresh}
        />
      )}
    </div>
  );
}