import { EditMemberDialog } from "./EditMemberDialog";
import { Member, MemberTableProps } from "./types";
import { MemberTableRow } from "./MemberTableRow";
import { useMembers } from "@/hooks/useMembers";
import { useQueryClient } from "@tanstack/react-query";

export function MemberTable({ members, currentUserIsAdmin }: MemberTableProps) {
  const { editingMember, setEditingMember, handleDeleteMember } = useMembers();
  const queryClient = useQueryClient();

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
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
          }}
        />
      )}
    </div>
  );
}