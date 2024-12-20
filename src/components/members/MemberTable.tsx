import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EditMemberDialog } from "./EditMemberDialog";
import { useToast } from "@/hooks/use-toast";
import { Member, MemberTableProps } from "./types";
import { MemberTableRow } from "./MemberTableRow";

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
            <MemberTableRow
              key={member.id}
              member={member}
              isCurrentUserAdmin={currentUserIsAdmin}
              onEdit={setEditingMember}
              onDelete={handleDeleteMember}
            />
          ))}
        </tbody>
      </table>

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