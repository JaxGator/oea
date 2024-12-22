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
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: memberId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete member",
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