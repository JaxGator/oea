import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { MemberTable } from "@/components/members/MemberTable";
import { AdminUserTableWrapper } from "./user-management/AdminUserTableWrapper";
import { CreateUserDialog } from "./user-management/CreateUserDialog";
import { BulkUserCreation } from "./user-management/BulkUserCreation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ViewMemberDialog } from "@/components/members/ViewMemberDialog";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";

export function AdminUserList() {
  const { toast } = useToast();
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, auth.users(email)')
        .order('username');

      if (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to fetch members",
          variant: "destructive",
        });
        throw error;
      }

      // Transform the data to include email from the joined users table
      const transformedData = data.map(profile => ({
        ...profile,
        email: profile.auth.users?.email || 'No email found'
      }));

      return transformedData as Member[];
    },
  });

  const handleEditComplete = () => {
    setEditingMember(null);
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading members</div>;
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
          members={members || []} 
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
        onUpdate={handleEditComplete}
      />
    </div>
  );
}