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
    if (!member) {
      console.warn('EditMemberHandler: Received null member');
    }
  }, [member]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      console.log('EditMemberHandler: Dialog closed');
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Only render dialog if we have a valid member
  if (!member) {
    console.warn('EditMemberHandler: Cannot render dialog without valid member data');
    return null;
  }

  return (
    <EditMemberDialog
      member={member}
      open={true}
      onOpenChange={handleDialogChange}
      onUpdate={onUpdate}
    />
  );
}