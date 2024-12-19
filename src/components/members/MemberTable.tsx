import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemberActions } from "./MemberActions";
import { EditMemberDialog } from "./EditMemberDialog";
import { useState } from "react";
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

interface MemberTableProps {
  members: Profile[];
  currentUserIsAdmin: boolean;
}

export function MemberTable({ members, currentUserIsAdmin }: MemberTableProps) {
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const { toast } = useToast();

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
              <TableCell>{member.username}</TableCell>
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
          }}
        />
      )}
    </>
  );
}