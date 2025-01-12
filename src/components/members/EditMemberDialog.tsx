import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Member } from "./types";
import { EditMemberHeader } from "./edit/EditMemberHeader";
import { EditMemberContent } from "./edit/EditMemberContent";
import { EditMemberProvider } from "./edit/EditMemberProvider";
import { EditMemberValidation } from "./edit/EditMemberValidation";

interface EditMemberDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updatedMember: Member) => void;
}

export function EditMemberDialog({ 
  member, 
  open, 
  onOpenChange, 
  onUpdate 
}: EditMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <EditMemberValidation 
          member={member} 
          open={open} 
          onOpenChange={onOpenChange} 
        />
        <EditMemberHeader />
        <EditMemberProvider>
          <EditMemberContent
            member={member}
            onUpdate={onUpdate}
            onClose={() => onOpenChange(false)}
          />
        </EditMemberProvider>
      </DialogContent>
    </Dialog>
  );
}