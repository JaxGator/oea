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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function AdminUserList() {
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { members, isLoading, error, refetch } = useMemberManagement();
  const { toast } = useToast();

  console.log('AdminUserList render:', { members, isLoading, error, editingMember, viewingMember });

  const handleEditMember = async (member: Member) => {
    try {
      console.log('Handling edit member:', member);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        toast({
          title: "Error",
          description: "You must be logged in to edit users.",
          variant: "destructive",
        });
        return;
      }

      // Set editing member state immediately for better UX
      setEditingMember(member);

      // Fetch latest profile data in background
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', member.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching member profile:', {
          error: fetchError,
          member,
          timestamp: new Date().toISOString()
        });
        toast({
          title: "Error",
          description: "Failed to load user profile. Please try again.",
          variant: "destructive",
        });
        setEditingMember(null);
        return;
      }

      if (!profile) {
        console.error('Profile not found:', {
          memberId: member.id,
          timestamp: new Date().toISOString()
        });
        toast({
          title: "Error",
          description: "User profile not found.",
          variant: "destructive",
        });
        setEditingMember(null);
        return;
      }

      // Update editing member with latest profile data
      setEditingMember({
        ...member,
        ...profile
      });
    } catch (error) {
      console.error('Error in handleEditMember:', {
        error,
        member,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setEditingMember(null);
    }
  };

  const handleCloseEdit = () => {
    console.log('Handling close edit');
    setEditingMember(null);
  };

  const handleDeleteMember = async (userId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
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
          onOpenChange={(open) => !open && handleCloseEdit()}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}