import { useState, useCallback } from "react";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useUserActions(refetchUsers: () => void) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateUserStatus = useCallback(async (userId: string) => {
    try {
      setIsUpdating(true);
      console.log('Updating user status:', userId);
      
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_approved: !profile.is_approved
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "User status updated successfully",
      });
      
      refetchUsers();
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
  }, [refetchUsers, toast]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    try {
      setIsUpdating(true);
      console.log('Deleting user:', userId);
      
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      refetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  }, [refetchUsers, toast]);

  return {
    isUpdating,
    handleUpdateUserStatus,
    handleDeleteUser
  };
}