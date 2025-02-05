
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Member } from "@/components/members/types";

export function useMembers() {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteMember = async (memberId: string) => {
    try {
      console.log('Attempting to delete member:', memberId);
      
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId: memberId }
      });

      if (error) {
        console.error('Delete function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No response from delete function');
      }

      console.log('Delete response:', data);

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });

      // Invalidate all relevant queries
      await queryClient.invalidateQueries({ queryKey: ['members'] });
      await queryClient.invalidateQueries({ queryKey: ['profiles'] });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  return {
    editingMember,
    setEditingMember,
    handleDeleteMember,
  };
}
