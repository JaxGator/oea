import { useCallback, useMemo } from "react";
import { Member } from "@/components/members/types";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberHandler } from "./user-management/EditMemberHandler";
import { useSessionCheck } from "@/hooks/auth/useSessionCheck";
import { UserListHeader } from "./user-management/UserListHeader";
import { UserListContent } from "./user-management/UserListContent";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { useViewMemberDialog } from "@/hooks/admin/useViewMemberDialog";
import { UserListError } from "./user-management/UserListError";
import { useUserList } from "@/hooks/admin/useUserList";
import { useUserActions } from "@/hooks/admin/useUserActions";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { AdminErrorBoundary } from "./error/AdminErrorBoundary";

export type UserFilters = {
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
};

export default function AdminUserList() {
  const { notify } = useNotifications();
  useSessionCheck();

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

  const {
    handleDeleteUser
  } = useUserActions(refetch);

  const memoizedHandleEdit = useCallback((member: Member) => {
    if (!member?.id || !member?.username) {
      console.error('Invalid member data for edit:', member);
      notify("error", "Invalid Data", "Member data is incomplete. Please try again.");
      return;
    }
    handleEditMember(member);
  }, [handleEditMember, notify]);

  const memoizedContent = useMemo(() => {
    console.log('Rendering memoized content with:', { 
      membersCount: data?.members?.length,
      isLoading,
      error,
      page,
      filters 
    });

    if (error) {
      console.error('Error fetching members:', error);
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
            onUpdate={handleUpdateComplete}
          />
        )}
      </div>
    );
  }, [
    data,
    error,
    filters,
    handleCloseEdit,
    handleCloseView,
    handleDeleteUser,
    handleFilterChange,
    handlePageChange,
    handleSearch,
    handleUpdateComplete,
    handleViewMember,
    isLoading,
    isViewDialogOpen,
    memoizedHandleEdit,
    page,
    refetch,
    viewingMember,
    editingMember
  ]);

  return <AdminErrorBoundary>{memoizedContent}</AdminErrorBoundary>;
}