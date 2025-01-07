import { Profile } from "@/types/auth";
import { MemberCard } from "../MemberCard";

interface MemberListContentProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
  onEdit: (member: Profile) => void;
  onDelete: (memberId: string) => void;
}

export function MemberListContent({
  members,
  currentUserIsAdmin,
  onEdit,
  onDelete,
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
        />
      ))}
    </div>
  );
}