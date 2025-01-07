import { Profile } from "@/types/auth";
import { MemberListContent } from "./MemberListContent";
import { EditMemberDialog } from "../EditMemberDialog";
import { useMembers } from "@/hooks/useMembers";
import { useQueryClient } from "@tanstack/react-query";
import { useMessageSubscription } from "@/hooks/members/useMessageSubscription";

interface MemberListContainerProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberListContainer({ 
  members: initialMembers, 
  currentUserIsAdmin, 
  isMobile 
}: MemberListContainerProps) {
  const { editingMember, setEditingMember, handleDeleteMember } = useMembers();
  const queryClient = useQueryClient();
  const members = useMessageSubscription(initialMembers);

  return (
    <>
      <MemberListContent
        members={members}
        currentUserIsAdmin={currentUserIsAdmin}
        onEdit={setEditingMember}
        onDelete={handleDeleteMember}
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