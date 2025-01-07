import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";

export function useMemberManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: members = [], // Provide empty array as default value
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      console.log('Fetching members...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      if (!data) {
        console.log('No members found');
        return [];
      }

      console.log('Members fetched successfully:', data.length, 'members');
      return data as Member[];
    },
    retry: 1,
    staleTime: 1000 * 60, // 1 minute
  });

  const updateMemberStatus = async (memberId: string, updates: Partial<Member>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      queryClient.setQueryData(['members'], (old: Member[] | undefined) => {
        if (!old) return [];
        return old.map(member => 
          member.id === memberId ? { ...member, ...updates } : member
        );
      });

      toast({
        title: "Success",
        description: "Member status updated successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status",
        variant: "destructive",
      });
    }
  };

  return {
    members,
    isLoading,
    error,
    refetch,
    updateMemberStatus
  };
}