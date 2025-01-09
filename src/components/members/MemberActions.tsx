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
  const { profile } = useProfile(user?.id);

  // Return null if no profile or trying to message self
  if (!profile || profile.id === member.id) return null;

  return (
    <div className="flex items-center gap-2">
      {profile.is_approved && <SendMessageDialog member={member} />}
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