import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { MemberTable } from "@/components/members/MemberTable";
import { AdminUserTableWrapper } from "./user-management/AdminUserTableWrapper";
import { CreateUserDialog } from "./user-management/CreateUserDialog";
import { BulkUserCreation } from "./user-management/BulkUserCreation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AdminUserList() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (error) {
        console.error('Error fetching members:', error);
        toast({
          title: "Error",
          description: "Failed to fetch members",
          variant: "destructive",
        });
        throw error;
      }

      return data as Member[];
    },
  });

  const handleBulkPasswordUpdate = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase.functions.invoke('bulk-password-update');
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Member passwords have been updated to 'oea-password'",
      });
    } catch (error) {
      console.error('Error updating passwords:', error);
      toast({
        title: "Error",
        description: "Failed to update member passwords",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading members</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <CreateUserDialog onUserCreated={refetch} />
          <BulkUserCreation />
          <Button 
            variant="outline" 
            onClick={handleBulkPasswordUpdate}
            disabled={isUpdating}
          >
            Update Member Passwords
          </Button>
        </div>
      </div>
      <AdminUserTableWrapper>
        <MemberTable members={members || []} currentUserIsAdmin={true} />
      </AdminUserTableWrapper>
    </div>
  );
}