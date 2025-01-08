import { useState } from "react";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useUserManagement(refetchMembers: () => void) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();

  const handleDeleteMember = async (userId: string) => {
    try {
      console.log('useUserManagement: Deleting user with ID:', userId);
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
      });

      refetchMembers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = (member: Member) => {
    console.log('useUserManagement: Setting editing member:', member);
    if (!member?.id || !member?.username) {
      toast({
        title: "Error",
        description: "Invalid member data. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setEditingMember(member);
  };

  const handleCloseEdit = () => {
    console.log('useUserManagement: Closing edit dialog');
    setEditingMember(null);
  };

  const handleUpdateComplete = () => {
    console.log('useUserManagement: Member update completed');
    toast({
      title: "Success",
      description: "Member updated successfully",
    });
    refetchMembers();
    handleCloseEdit();
  };

  return {
    editingMember,
    handleEditMember,
    handleCloseEdit,
    handleDeleteMember,
    handleUpdateComplete,
  };
}