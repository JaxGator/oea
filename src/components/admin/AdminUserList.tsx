import { useState, useCallback } from "react";
import { UserListHeader } from "./user-management/UserListHeader";
import { UserListContent } from "./user-management/UserListContent";
import { useUserList } from "@/hooks/admin/useUserList";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { Member } from "../members/types";
import { UserFilters } from "./user-management/UserFilters";
import { EditMemberHandler } from "./user-management/EditMemberHandler";
import { DeleteUserDialog } from "./user-management/DeleteUserDialog";

export interface UserFilters {
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
}

export function AdminUserList() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
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

  const handleViewMember = useCallback((member: Member) => {
    console.log('Viewing member:', member);
    // Add view functionality if needed
  }, []);

  return (
    <div className="space-y-6">
      <UserListHeader onSearch={handleSearch}>
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </UserListHeader>

      <UserListContent
        members={data?.members || []}
        isLoading={isLoading}
        error={error}
        onEditMember={handleEditMember}
        onDeleteMember={handleDeleteMember}
        onViewMember={handleViewMember}
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={handlePageChange}
      />

      {editingMember && (
        <EditMemberHandler
          member={editingMember}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateComplete}
        />
      )}

      {selectedUser && (
        <DeleteUserDialog
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
          onConfirm={() => {
            if (selectedUser) {
              handleDeleteMember(selectedUser);
              setSelectedUser(null);
            }
          }}
          username={selectedUser}
        />
      )}
    </div>
  );
}