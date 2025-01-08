import { useState, useEffect } from "react";
import { Member } from "@/components/members/types";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EditMemberHandlerProps {
  member: Member | null;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditMemberHandler({ member, onClose, onUpdate }: EditMemberHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('EditMemberHandler: member prop changed:', member);
  }, [member]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      console.log('EditMemberHandler: Dialog closed');
      onClose();
    }
  };

  console.log('EditMemberHandler: Rendering with member:', member);
  console.log('EditMemberHandler: Is member null?', !member);

  // Test member for debugging
  const testMember: Member = {
    id: "test-id",
    username: "test-user",
    full_name: "Test User",
    avatar_url: null,
    is_admin: false,
    is_approved: true,
    is_member: true
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Use the actual member if available, otherwise use testMember for debugging
  const memberToEdit = member || testMember;

  return (
    <EditMemberDialog
      member={memberToEdit}
      open={!!member}
      onOpenChange={handleDialogChange}
      onUpdate={onUpdate}
    />
  );
}