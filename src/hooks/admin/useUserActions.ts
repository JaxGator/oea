
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/utils/sessionUtils";

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
      
      await refetchUsers();
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
      console.log('Attempting to delete user:', userId);

      const session = await getSession();
      if (!session) {
        throw new Error('No active session found');
      }

      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      await refetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
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
