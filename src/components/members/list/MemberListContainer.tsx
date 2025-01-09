import { Profile } from "@/types/auth";
import { MemberListContent } from "./MemberListContent";
import { EditMemberDialog } from "../EditMemberDialog";
import { useMembers } from "@/hooks/useMembers";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageSubscription } from "@/hooks/members/useMessageSubscription";
import { Member } from "../types";

interface MemberListContainerProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
}

export function MemberListContainer({ 
  members: initialMembers, 
  currentUserIsAdmin, 
  isMobile,
  onViewMember,
  onEditMember
}: MemberListContainerProps) {
  const { editingMember, setEditingMember, handleDeleteMember } = useMembers();
  const queryClient = useQueryClient();
  const members = useMessageSubscription(initialMembers);

  return (
    <>
      <MemberListContent
        members={members}
        currentUserIsAdmin={currentUserIsAdmin}
        onEdit={onEditMember}
        onDelete={handleDeleteMember}
        onView={onViewMember}
      />

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