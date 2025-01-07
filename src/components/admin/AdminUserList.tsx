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

  console.log('AdminUserList render:', { members, isLoading, error });

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      console.error('Error loading members:', error);
      return <ErrorState message="Error loading members. Please try refreshing the page." />;
    }

    if (!Array.isArray(members)) {
      console.error('Members is not an array:', members);
      return <ErrorState message="Invalid data format. Please try refreshing the page." />;
    }

    return (
      <AdminUserTableWrapper>
        <MemberTable 
          members={members} 
          currentUserIsAdmin={true} 
          onViewMember={setViewingMember}
          onEditMember={setEditingMember}
        />
      </AdminUserTableWrapper>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <CreateUserDialog onUserCreated={refetch} />
          <BulkUserCreation />
        </div>
      </div>

      {renderContent()}

      {viewingMember && (
        <ViewMemberDialog
          member={viewingMember}
          open={!!viewingMember}
          onOpenChange={(open) => !open && setViewingMember(null)}
        />
      )}

      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}