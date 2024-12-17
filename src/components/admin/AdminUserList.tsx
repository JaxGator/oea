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

interface Profile {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
}

export function AdminUserList() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleUpdateStatus = async (email: string) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase.functions.invoke('set-admin-status', {
        body: { email }
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
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.username}</TableCell>
              <TableCell>{profile.full_name || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
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
                <AdminUserActions
                  profile={profile}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={isUpdating}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}