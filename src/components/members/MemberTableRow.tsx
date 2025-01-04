import { Member } from "./types";
import { MemberStatusBadges } from "./MemberStatusBadges";
import { MemberActions } from "./MemberActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface MemberTableRowProps {
  member: Member;
  isCurrentUserAdmin: boolean;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onView: (member: Member) => void;
}

export function MemberTableRow({ 
  member, 
  isCurrentUserAdmin, 
  onEdit, 
  onDelete,
  onView
}: MemberTableRowProps) {
  return (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
      <td className="px-6 py-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
          onClick={() => onView(member)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onView(member);
            }
          }}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={member.avatar_url || ''} 
              alt={`${member.username}'s profile picture`} 
            />
            <AvatarFallback>
              <UserCircle className="h-8 w-8" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <span>{member.username}</span>
        </div>
      </td>
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