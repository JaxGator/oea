import { Card } from "@/components/ui/card";
import { Member } from "./types";
import { MemberStatusBadges } from "./MemberStatusBadges";
import { MemberActions } from "./MemberActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface MemberCardProps {
  member: Member;
  currentUserIsAdmin: boolean;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onClick?: () => void;
}

export function MemberCard({ 
  member, 
  currentUserIsAdmin,
  onEdit,
  onDelete,
  onClick 
}: MemberCardProps) {
  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={member.avatar_url || ''} 
                alt={`${member.username}'s profile picture`}
              />
              <AvatarFallback>
                <UserCircle className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-medium truncate max-w-[150px]">{member.username}</h3>
              {member.full_name && (
                <p className="text-sm text-gray-500 truncate max-w-[150px]">{member.full_name}</p>
              )}
            </div>
          </div>
          <div>
            <MemberActions
              member={member}
              onEdit={() => onEdit(member)}
              onDelete={() => onDelete(member.id)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <MemberStatusBadges
            isAdmin={member.is_admin}
            isApproved={member.is_approved}
            isMember={member.is_member}
          />
        </div>
      </div>
    </Card>
  );
}