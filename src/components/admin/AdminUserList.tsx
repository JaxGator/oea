import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, UserCheck, Users } from "lucide-react";
import { AdminUserActions } from "./AdminUserActions";
import { EditMemberDialog } from "../members/EditMemberDialog";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  created_at: string;
}

export function AdminUserList() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);

  const { data: profiles = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;
      return profiles;
    },
  });

  const handleUpdateStatus = async (username: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase.functions.invoke('set-admin-status', {
        body: { username }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 p-4">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden md:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">User</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{profile.username}</span>
                        <span className="text-sm text-gray-500">{profile.full_name || '-'}</span>
                        <div className="flex flex-wrap gap-1 md:hidden mt-2">
                          {profile.is_admin && (
                            <Badge variant="default" className="bg-red-500">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {profile.is_approved && (
                            <Badge variant="default" className="bg-green-500">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                          {profile.is_member && (
                            <Badge variant="default" className="bg-blue-500">
                              <Users className="h-3 w-3 mr-1" />
                              Member
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {profile.is_admin && (
                          <Badge variant="default" className="bg-red-500">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {profile.is_approved && (
                          <Badge variant="default" className="bg-green-500">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                        {profile.is_member && (
                          <Badge variant="default" className="bg-blue-500">
                            <Users className="h-3 w-3 mr-1" />
                            Member
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMember(profile)}
                          className="w-full sm:w-auto"
                        >
                          Edit
                        </Button>
                        <AdminUserActions
                          profile={profile}
                          onUpdateStatus={handleUpdateStatus}
                          isUpdating={isUpdating}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedMember && (
        <EditMemberDialog
          member={selectedMember}
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}