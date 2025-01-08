import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberActions } from "./MemberActions";
import { Profile } from "@/types/auth";
import { Member } from "./types";

interface MemberCardProps {
  member: Profile;
  currentUserIsAdmin: boolean;
  onEdit: (member: Profile) => void;
  onDelete: (memberId: string) => void;
}

export function MemberCard({ member, currentUserIsAdmin, onEdit, onDelete }: MemberCardProps) {
  // Convert Profile to Member type for MemberActions
  const memberData: Member = {
    id: member.id,
    username: member.username,
    full_name: member.full_name,
    avatar_url: member.avatar_url,
    is_admin: member.is_admin || false,
    is_approved: member.is_approved || false,
    is_member: member.is_member || false
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={member.avatar_url || ''} 
              alt={`${member.username}'s profile picture`} 
            />
            <AvatarFallback>
              <UserCircle className="h-12 w-12" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{member.username}</p>
              {member.has_unread_messages && (
                <MessageSquare className="h-4 w-4 text-primary animate-pulse" />
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{member.full_name || '-'}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {member.is_admin && (
                <Badge variant="default">Admin</Badge>
              )}
              {member.is_approved ? (
                <Badge variant="secondary">Approved</Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
              {member.is_member && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Member
                </Badge>
              )}
            </div>
          </div>
          {currentUserIsAdmin && (
            <MemberActions
              member={memberData}
              onEdit={() => onEdit(member)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}