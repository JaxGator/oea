import { Member } from "./types";
import { Button } from "@/components/ui/button";
import { SendMessageDialog } from "./communication/SendMessageDialog";
import { useProfile } from "@/hooks/auth/useProfile";
import { useSession } from "@/hooks/auth/useSession";

interface MemberActionsProps {
  member: Member;
  onEdit?: (member: Member) => void;
}

export function MemberActions({ member, onEdit }: MemberActionsProps) {
  const { user } = useSession();
  const { profile, isLoading } = useProfile(user?.id);

  // Return null if loading, no profile, or trying to message self
  if (isLoading || !profile || profile.id === member.id) return null;

  // Check if the current user is approved and is a member
  const canMessage = profile.is_approved && profile.is_member;

  console.log('MemberActions:', {
    profileId: profile.id,
    memberId: member.id,
    isApproved: profile.is_approved,
    isMember: profile.is_member,
    canMessage
  });

  return (
    <div className="flex items-center gap-2">
      {canMessage && (
        <SendMessageDialog member={member} />
      )}
      {profile.is_admin && onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(member)}
        >
          Edit
        </Button>
      )}
    </div>
  );
}