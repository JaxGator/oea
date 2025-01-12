import { Member } from "../types";
import { EditMemberDialog } from "../EditMemberDialog";
import { ViewMemberDialog } from "../ViewMemberDialog";
import { useToast } from "@/hooks/use-toast";

interface MemberDialogManagerProps {
  selectedMember: Member | null;
  isEditDialogOpen: boolean;
  isViewDialogOpen: boolean;
  currentUserIsAdmin: boolean;
  onEditDialogChange: (open: boolean) => void;
  onViewDialogChange: (open: boolean) => void;
}

export function MemberDialogManager({
  selectedMember,
  isEditDialogOpen,
  isViewDialogOpen,
  currentUserIsAdmin,
  onEditDialogChange,
  onViewDialogChange,
}: MemberDialogManagerProps) {
  const { toast } = useToast();

  const handleMemberUpdate = () => {
    console.log('Member updated, refreshing data...');
    toast({
      title: "Success",
      description: "Member details updated successfully.",
    });
  };

  if (!selectedMember) return null;

  return (
    <>
      <ViewMemberDialog
        member={selectedMember}
        open={isViewDialogOpen}
        onOpenChange={onViewDialogChange}
      />
      
      {currentUserIsAdmin && (
        <EditMemberDialog
          member={selectedMember}
          open={isEditDialogOpen}
          onOpenChange={onEditDialogChange}
          onUpdate={handleMemberUpdate}
        />
      )}
    </>
  );
}