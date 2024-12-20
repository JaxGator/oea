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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminUserTableHeader } from "./user-management/AdminUserTableHeader";
import { AdminUserTableRow } from "./user-management/AdminUserTableRow";
import { AdminUserTableWrapper } from "./user-management/AdminUserTableWrapper";

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
    return (
      <div className="p-4" role="status" aria-live="polite">
        <span className="sr-only">Loading users...</span>
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminUserTableHeader />
      <AdminUserTableWrapper>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="whitespace-nowrap">User</TableHead>
              <TableHead scope="col" className="hidden md:table-cell">Status</TableHead>
              <TableHead scope="col">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <AdminUserTableRow
                key={profile.id}
                profile={profile}
                onEdit={setSelectedMember}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
              />
            ))}
          </TableBody>
        </Table>
      </AdminUserTableWrapper>

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