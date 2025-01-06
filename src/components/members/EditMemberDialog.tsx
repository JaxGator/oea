import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberFormFields } from "./MemberFormFields";
import { MemberAvatarUpload } from "./MemberAvatarUpload";
import { useMemberForm } from "./useMemberForm";

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
  } = useMemberForm(member, onUpdate, () => onOpenChange(false));

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
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}