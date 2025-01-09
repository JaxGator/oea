import { Member } from "./types";
import { MemberStatusBadges } from "./MemberStatusBadges";
import { MemberActions } from "./MemberActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { useMessageReading } from "@/hooks/messages/useMessageReading";
import { useSession } from "@/hooks/auth/useSession";

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
  const { user } = useSession();
  const { markMessagesAsRead } = useMessageReading();

  const handleView = () => {
    onView(member);
    // Mark messages as read when viewing a member's profile
    if (user?.id) {
      markMessagesAsRead({
        receiverId: user.id,
        senderId: member.id
      });
    }
  };

  return (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
      <td className="px-6 py-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
          onClick={handleView}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleView();
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
        {isCurrentUserAdmin && (
          <MemberActions
            member={member}
            onEdit={() => onEdit(member)}
          />
        )}
      </td>
    </tr>
  );
}