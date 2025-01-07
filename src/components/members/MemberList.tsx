import { EditMemberDialog } from "./EditMemberDialog";
import { useMembers } from "@/hooks/useMembers";
import { useQueryClient } from "@tanstack/react-query";
import { Profile } from "@/types/auth";
import { MemberCard } from "./MemberCard";
import { useMessageSubscription } from "@/hooks/members/useMessageSubscription";

interface MemberListProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberList({ members: initialMembers, currentUserIsAdmin, isMobile }: MemberListProps) {
  const { editingMember, setEditingMember, handleDeleteMember } = useMembers();
  const queryClient = useQueryClient();
  const members = useMessageSubscription(initialMembers);

  return (
    <>
      <div className="space-y-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserIsAdmin={currentUserIsAdmin}
            onEdit={setEditingMember}
            onDelete={handleDeleteMember}
          />
        ))}
      </div>

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
    </>
  );
}