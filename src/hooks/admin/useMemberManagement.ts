import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/components/members/types";
import { useToast } from "@/hooks/use-toast";

export function useMemberManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { 
    data: members = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      console.log('Fetching members...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username');

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      if (!profiles) {
        console.log('No profiles found');
        return [];
      }

      // Map database profiles to Member type
      const members: Member[] = profiles.map(profile => ({
        id: profile.id,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        is_admin: profile.is_admin || false,
        is_approved: profile.is_approved || false,
        is_member: profile.is_member || false,
        created_at: profile.created_at
      }));

      console.log('Members fetched successfully:', members.length, 'members');
      return members;
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