import { Profile } from "@/types/auth";
import { MemberCard } from "../MemberCard";
import { Member } from "../types";

interface MemberListContentProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onView: (member: Member) => void;
}

export function MemberListContent({
  members,
  currentUserIsAdmin,
  onEdit,
  onDelete,
  onView
}: MemberListContentProps) {
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserIsAdmin={currentUserIsAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={() => onView(member)}
        />
      ))}
    </div>
  );
}