
import { Member } from "../types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberStatusBadges } from "../MemberStatusBadges";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface MemberListContentProps {
  members: Member[];
  currentUserIsAdmin: boolean;
  onEdit?: (member: Member) => void;
  onDelete?: (member: Member) => void;
  onView?: (member: Member) => void;
}

export function MemberListContent({
  members,
  currentUserIsAdmin,
  onEdit,
  onDelete,
  onView
}: MemberListContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={member.id} className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar_url || ''} alt={member.username} />
              <AvatarFallback>{member.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-medium truncate">{member.username}</h3>
                  {member.full_name && (
                    <p className="text-sm text-muted-foreground truncate">
                      {member.full_name}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(member)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {currentUserIsAdmin && onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(member)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                <MemberStatusBadges 
                  isAdmin={member.is_admin}
                  isApproved={member.is_approved}
                  isMember={member.is_member}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
