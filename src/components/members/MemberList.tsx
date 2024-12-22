import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberActions } from "./MemberActions";
import { EditMemberDialog } from "./EditMemberDialog";
import { useMembers } from "@/hooks/useMembers";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";

interface MemberListProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
  isMobile: boolean;
}

export function MemberList({ members: initialMembers, currentUserIsAdmin, isMobile }: MemberListProps) {
  const [members, setMembers] = useState<Profile[]>(initialMembers);
  const { editingMember, setEditingMember, handleDeleteMember } = useMembers();
  const queryClient = useQueryClient();

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  useEffect(() => {
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload: any) => {
          setMembers(prevMembers => 
            prevMembers.map(member => {
              if (member.id === payload.new.receiver_id) {
                return { ...member, has_unread_messages: true };
              }
              return member;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
                    memberId={member.id}
                    memberName={member.username}
                    isCurrentUserAdmin={currentUserIsAdmin}
                    onDelete={() => handleDeleteMember(member.id)}
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
            queryClient.invalidateQueries({ queryKey: ['members'] });
          }}
        />
      )}
    </>
  );
}