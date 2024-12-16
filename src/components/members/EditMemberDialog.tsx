import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemberFormFields } from "./MemberFormFields";
import { useMemberForm } from "./useMemberForm";

interface EditMemberDialogProps {
  member: {
    id: string;
    username: string;
    full_name: string | null;
    is_admin: boolean;
    is_approved: boolean;
    is_member: boolean;
    email?: string;
  };
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
    handleSubmit,
  } = useMemberForm(member, onUpdate, () => onOpenChange(false));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}