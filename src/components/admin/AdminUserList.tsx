import { useState } from "react";
import { Member } from "@/components/members/types";
import { MemberTable } from "@/components/members/MemberTable";
import { AdminUserTableWrapper } from "./user-management/AdminUserTableWrapper";
import { CreateUserDialog } from "./user-management/CreateUserDialog";
import { BulkUserCreation } from "./user-management/BulkUserCreation";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { LoadingState } from "./user-management/LoadingState";
import { ErrorState } from "./user-management/ErrorState";
import { useMemberManagement } from "@/hooks/admin/useMemberManagement";

export function AdminUserList() {
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { members, isLoading, error, refetch } = useMemberManagement();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error('Error loading members:', error);
    return <ErrorState />;
  }

  if (!members) {
    return <ErrorState message="No members found" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <CreateUserDialog onUserCreated={refetch} />
          <BulkUserCreation />
        </div>
      </div>
      <AdminUserTableWrapper>
        <MemberTable 
          members={members} 
          currentUserIsAdmin={true} 
          onViewMember={setViewingMember}
          onEditMember={setEditingMember}
        />
      </AdminUserTableWrapper>

      <ViewMemberDialog
        member={viewingMember}
        open={!!viewingMember}
        onOpenChange={(open) => !open && setViewingMember(null)}
      />

      <EditMemberDialog
        member={editingMember}
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        onUpdate={refetch}
      />
    </div>
  );
}