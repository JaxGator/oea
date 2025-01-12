import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MemberAvatarUpload } from "./MemberAvatarUpload";
import { useMemberForm } from "./useMemberForm";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Member } from "./types";
import { EditMemberHeader } from "./edit/EditMemberHeader";
import { EditMemberForm } from "./edit/EditMemberForm";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        return;
      }
      console.log('EditMemberDialog opened with member data:', member);
    }
  }, [open, member, onOpenChange, toast]);

  const {
    avatarUrl,
    setAvatarUrl,
    username,
    setUsername,
    fullName,
    setFullName,
    isAdmin,
    setIsAdmin,
    isApproved,
    setIsApproved,
    isMember,
    setIsMember,
    handleSubmit,
  } = useMemberForm(member, () => {
    const updatedMember: Member = {
      ...member,
      username,
      full_name: fullName,
      avatar_url: avatarUrl,
      is_admin: isAdmin,
      is_approved: isApproved,
      is_member: isMember,
    };
    onUpdate(updatedMember);
  }, onOpenChange);

  const handleFormSubmit = async () => {
    try {
      setIsSubmitting(true);
      await handleSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  if (!member?.id || !member?.username) {
    console.error('EditMemberDialog: Cannot render without valid member data');
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <EditMemberHeader />
        <div className="space-y-6">
          <MemberAvatarUpload
            memberId={member.id}
            username={member.username}
            avatarUrl={avatarUrl || member.avatar_url || ''}
            onAvatarUpdate={setAvatarUrl}
          />

          <EditMemberForm
            member={member}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            username={username}
            setUsername={setUsername}
            fullName={fullName}
            setFullName={setFullName}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            isApproved={isApproved}
            setIsApproved={setIsApproved}
            isMember={isMember}
            setIsMember={setIsMember}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}