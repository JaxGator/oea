import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberFormFields } from "./MemberFormFields";
import { MemberAvatarUpload } from "./MemberAvatarUpload";
import { useMemberForm } from "./useMemberForm";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Member {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

interface EditMemberDialogProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditMemberDialog({ member, open, onOpenChange, onUpdate }: EditMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    username,
    setUsername,
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    isAdmin,
    setIsAdmin,
    isApproved,
    setIsApproved,
    isMember,
    setIsMember,
    avatarUrl,
    setAvatarUrl,
    handleSubmit,
  } = useMemberForm(member, onUpdate, () => {
    setIsSubmitting(false);
    onOpenChange(false);
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    await handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <MemberAvatarUpload
            memberId={member.id}
            username={username}
            avatarUrl={avatarUrl}
            onAvatarUpdate={setAvatarUrl}
          />

          <MemberFormFields
            username={username}
            setUsername={setUsername}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            isApproved={isApproved}
            setIsApproved={setIsApproved}
            isMember={isMember}
            setIsMember={setIsMember}
            onSubmit={onSubmit}
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}