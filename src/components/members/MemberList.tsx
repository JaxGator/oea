import { Profile } from "@/types/auth";
import { MemberListContainer } from "./list/MemberListContainer";
import { Member } from "./types";

interface MemberListProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
  onViewMember: (member: Member) => void;
  onEditMember: (member: Member) => void;
}

export function MemberList({
  members,
  currentUserIsAdmin,
  isMobile,
  onViewMember,
  onEditMember
}: MemberListProps) {
  return (
    <MemberListContainer 
      members={members}
      currentUserIsAdmin={currentUserIsAdmin}
      isMobile={isMobile}
      onViewMember={onViewMember}
      onEditMember={onEditMember}
    />
  );
}