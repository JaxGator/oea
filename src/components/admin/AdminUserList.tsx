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

interface ProfileWithEmail {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
  email: string | null;
}

export function AdminUserList() {
  const { toast } = useToast();
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      try {
        // First, get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('username');

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Then, fetch emails using the Edge Function
        const { data: emailData, error: emailError } = await supabase.functions.invoke('get-user-emails');
        
        if (emailError) {
          console.error('Error fetching user emails:', emailError);
          // Don't throw here, just return profiles without emails
          return profiles.map(profile => ({
            ...profile,
            email: null
          }));
        }

        // Create a map of user IDs to emails from the Edge Function response
        const emailMap = new Map(
          (emailData || []).map((user: { id: string; email: string }) => [user.id, user.email])
        );

        // Combine the data
        return profiles.map(profile => ({
          ...profile,
          email: emailMap.get(profile.id) || null,
        })) as ProfileWithEmail[];
      } catch (error) {
        console.error('Error in members query:', error);
        toast({
          title: "Error",
          description: "Failed to load members. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
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