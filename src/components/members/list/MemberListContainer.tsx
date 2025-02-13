
import { Member, createMemberFromPartial } from "../types";
import { MemberListContent } from "./MemberListContent";
import { EditMemberDialog } from "../EditMemberDialog";
import { useMembers } from "@/hooks/useMembers";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageSubscription } from "@/hooks/members/useMessageSubscription";

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
  
  // Transform any potential partial member data to full Member objects
  const members = useMessageSubscription(
    initialMembers.map(member => createMemberFromPartial(member))
  );

  const handleDelete = (member: Member) => {
    if (member.id) {
      handleDeleteMember(member.id);
    }
  };

  return (
    <>
      <MemberListContent
        members={members}
        currentUserIsAdmin={currentUserIsAdmin}
        onEdit={onEditMember}
        onDelete={handleDelete}
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
