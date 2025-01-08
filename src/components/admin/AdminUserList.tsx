import { useState } from "react";
import { Member } from "@/components/members/types";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberHandler } from "./user-management/EditMemberHandler";
import { useMemberManagement } from "@/hooks/admin/useMemberManagement";
import { useSessionCheck } from "@/hooks/auth/useSessionCheck";
import { UserListHeader } from "./user-management/UserListHeader";
import { UserListContent } from "./user-management/UserListContent";
import { useUserManagement } from "@/hooks/admin/useUserManagement";

export function AdminUserList() {
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const { members, isLoading, error, refetch } = useMemberManagement();
  const {
    editingMember,
    handleEditMember,
    handleCloseEdit,
    handleDeleteMember,
    handleUpdateComplete,
  } = useUserManagement(refetch);

  useSessionCheck();

  return (
    <div className="space-y-4">
      <UserListHeader onUserCreated={refetch} />
      
      <UserListContent
        members={members}
        isLoading={isLoading}
        error={error}
        onEditMember={handleEditMember}
        onDeleteMember={handleDeleteMember}
      />

      {viewingMember && (
        <ViewMemberDialog
          member={viewingMember}
          open={!!viewingMember}
          onOpenChange={(open) => !open && setViewingMember(null)}
        />
      )}

      <EditMemberHandler
        member={editingMember}
        onClose={handleCloseEdit}
        onUpdate={handleUpdateComplete}
      />
    </div>
  );
}