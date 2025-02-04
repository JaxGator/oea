import { Member } from "./types";
import { MemberCard } from "./MemberCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserIsAdmin={currentUserIsAdmin}
          onEdit={onEditMember}
          onDelete={() => {}} // We'll implement this later if needed
          onClick={() => onViewMember(member)}
        />
      ))}
    </div>
  );
}