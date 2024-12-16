import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { useToast } from "@/hooks/use-toast";
import { MemberActions } from "@/components/members/MemberActions";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuthState } from "@/hooks/useAuthState";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export default function Members() {
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuthState();

  // If user is not approved, show a message
  if (profile && !profile.is_approved) {
    return (
      <div className="min-h-screen bg-[#222222] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
            <p className="text-gray-600">
              You need to be approved by an admin to view the members directory.
              Please wait for admin approval or contact an administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { data: members = [], isLoading: isLoadingMembers, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user && !!profile?.is_approved, // Only fetch if user is approved
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (profile) {
      setCurrentUserIsAdmin(profile.is_admin);
    }
  }, [profile]);

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load members. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Error loading members. Please try again.</div>
      </div>
    );
  }

  if (isLoadingMembers) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Member Directory</h1>
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No members found.
            </div>
          ) : (
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
                        <AvatarImage src={member.avatar_url || ''} alt={member.username} />
                        <AvatarFallback>
                          <UserCircle className="h-10 w-10" />
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
                          isCurrentUserAdmin={currentUserIsAdmin}
                          onDelete={() => {
                            // Refetch will happen automatically due to React Query
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
          )}
        </div>
      </div>

      {editingMember && (
        <EditMemberDialog
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onUpdate={() => {
            // Refetch will happen automatically due to React Query
            toast({
              title: "Success",
              description: "Member has been updated",
            });
          }}
        />
      )}
    </div>
  );
}