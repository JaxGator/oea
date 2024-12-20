import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditMemberDialog } from "./EditMemberDialog";
import { MemberActions } from "./MemberActions";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

interface Member {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

interface MemberTableProps {
  members: Member[];
  currentUserIsAdmin: boolean;
}

export function MemberTable({ members, currentUserIsAdmin }: MemberTableProps) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: memberId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3">Username</th>
              <th className="px-6 py-3">Full Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr 
                key={member.id}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <td className="px-6 py-4">{member.username}</td>
                <td className="px-6 py-4">{member.full_name || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {member.is_admin && (
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    )}
                    {member.is_approved && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    )}
                    {member.is_member && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Member
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <MemberActions
                    memberId={member.id}
                    memberName={member.username}
                    isCurrentUserAdmin={currentUserIsAdmin}
                    onEdit={() => setEditingMember(member)}
                    onDelete={() => handleDeleteMember(member.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['members'] })}
        />
      )}
    </div>
  );
}