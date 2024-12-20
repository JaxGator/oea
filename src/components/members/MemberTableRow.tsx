import { Member } from "./types";
import { MemberStatusBadges } from "./MemberStatusBadges";
import { MemberActions } from "./MemberActions";

interface MemberTableRowProps {
  member: Member;
  isCurrentUserAdmin: boolean;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

export function MemberTableRow({ 
  member, 
  isCurrentUserAdmin, 
  onEdit, 
  onDelete 
}: MemberTableRowProps) {
  return (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
      <td className="px-6 py-4">{member.username}</td>
      <td className="px-6 py-4">{member.full_name || '-'}</td>
      <td className="px-6 py-4">
        <MemberStatusBadges
          isAdmin={member.is_admin}
          isApproved={member.is_approved}
          isMember={member.is_member}
        />
      </td>
      <td className="px-6 py-4">
        <MemberActions
          memberId={member.id}
          memberName={member.username}
          isCurrentUserAdmin={isCurrentUserAdmin}
          onEdit={() => onEdit(member)}
          onDelete={() => onDelete(member.id)}
        />
      </td>
    </tr>
  );
}