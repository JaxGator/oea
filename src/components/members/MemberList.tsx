import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberActions } from "./MemberActions";
import { EditMemberDialog } from "./EditMemberDialog";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

interface MemberListProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberList({ members, currentUserIsAdmin, isMobile }: MemberListProps) {
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const { toast } = useToast();

  return (
    <>
      <div className="space-y-4">
        {members.map((member) => (
          <Card key={member.id} className="w-full">
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
                  <p className="text-sm font-medium truncate">{member.username}</p>
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
                    memberId={member.id}
                    memberName={member.username}
                    isCurrentUserAdmin={currentUserIsAdmin}
                    onDelete={() => {
                      toast({
                        title: "Success",
                        description: "Member has been deleted",
                      });
                    }}
                    onEdit={() => setEditingMember(member)}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdate={() => {
            toast({
              title: "Success",
              description: "Member updated successfully",
            });
          }}
        />
      )}
    </>
  );
}