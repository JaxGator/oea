import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Member } from "./types";
import { MemberStatusBadges } from "./MemberStatusBadges";

interface ViewMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewMemberDialog({ member, open, onOpenChange }: ViewMemberDialogProps) {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={member.avatar_url || ''}
              alt={`${member.username}'s profile picture`}
            />
            <AvatarFallback>
              <UserCircle className="h-24 w-24" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{member.username}</h3>
            {member.full_name && (
              <p className="text-sm text-gray-500">{member.full_name}</p>
            )}
          </div>
          <div className="flex justify-center">
            <MemberStatusBadges
              isAdmin={member.is_admin}
              isApproved={member.is_approved}
              isMember={member.is_member}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}