import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberActions } from "./MemberActions";
import { EditMemberDialog } from "./EditMemberDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  has_unread_messages?: boolean;
}

interface MemberTableProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
}

export function MemberTable({ members: initialMembers, currentUserIsAdmin }: MemberTableProps) {
  const [members, setMembers] = useState<Profile[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const { toast } = useToast();
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Status</TableHead>
            {currentUserIsAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={member.avatar_url || ''} 
                    alt={`${member.username}'s profile picture`}
                  />
                  <AvatarFallback>
                    <UserCircle className="h-10 w-10" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {member.username}
                  {member.has_unread_messages && (
                    <MessageSquare className="h-4 w-4 text-primary animate-pulse" />
                  )}
                </div>
              </TableCell>
              <TableCell>{member.full_name || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
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
              </TableCell>
              {currentUserIsAdmin && (
                <TableCell>
                  <MemberActions
                    memberId={member.id}
                    memberName={member.username}
                    isCurrentUserAdmin={currentUserIsAdmin}
                    onDelete={() => {
                      toast({
                        title: "Success",
                        description: "Member has been deleted",
                      });
                      queryClient.invalidateQueries({ queryKey: ['members'] });
                    }}
                    onEdit={() => setEditingMember(member)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
            queryClient.invalidateQueries({ queryKey: ['members'] });
          }}
        />
      )}
    </>
  );
}