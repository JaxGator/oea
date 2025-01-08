import { useState, useCallback } from "react";
import { Member } from "@/components/members/types";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberHandler } from "./user-management/EditMemberHandler";
import { useMemberManagement } from "@/hooks/admin/useMemberManagement";
import { useSessionCheck } from "@/hooks/auth/useSessionCheck";
import { UserListHeader } from "./user-management/UserListHeader";
import { UserListContent } from "./user-management/UserListContent";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

export function AdminUserList() {
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { members, isLoading, error, refetch } = useMemberManagement(debouncedSearch);
  const { toast } = useToast();
  
  const {
    editingMember,
    handleEditMember,
    handleCloseEdit,
    handleDeleteMember,
    handleUpdateComplete,
  } = useUserManagement(refetch);

  useSessionCheck();

  const handleEdit = (member: Member) => {
    if (!member?.id || !member?.username) {
      console.error('AdminUserList: Invalid member data for edit:', member);
      toast({
        title: "Error",
        description: "Invalid member data. Please try again.",
        variant: "destructive",
      });
      return;
    }
    console.log('AdminUserList: Handling edit for member:', member);
    handleEditMember(member);
  };

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return (
    <div className="space-y-4">
      <UserListHeader 
        onUserCreated={refetch}
        onSearch={handleSearch}
      />
      
      <UserListContent
        members={members}
        isLoading={isLoading}
        error={error}
        onEditMember={handleEdit}
        onDeleteMember={handleDeleteMember}
      />

      {viewingMember && (
        <ViewMemberDialog
          member={viewingMember}
          open={!!viewingMember}
          onOpenChange={(open) => !open && setViewingMember(null)}
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