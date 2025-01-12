import { useEffect } from "react";
import { Member } from "../types";
import { useToast } from "@/hooks/use-toast";

interface EditMemberValidationProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberValidation({ 
  member, 
  open, 
  onOpenChange 
}: EditMemberValidationProps) {
  const { toast } = useToast();
  
  useEffect(() => {
    if (open) {
      if (!member?.id || !member?.username) {
        console.error('EditMemberDialog: Invalid member data:', member);
        toast({
          title: "Error",
          description: "Invalid member data provided",
          variant: "destructive",
        });
        onOpenChange(false);
      } else {
        console.log('EditMemberDialog opened with member data:', member);
      }
    }
  }, [open, member, onOpenChange, toast]);

  if (!member?.id || !member?.username) {
    console.error('EditMemberDialog: Cannot render without valid member data');
    return null;
  }

  return null;
}