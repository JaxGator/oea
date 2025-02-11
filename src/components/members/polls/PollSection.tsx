
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PollCard } from "./PollCard";
import { CreatePollDialog } from "./CreatePollDialog";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PollWithDetails, PollVoteCount, Poll } from "@/types/database.types";

export function PollSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { profile } = useAuthState();

  const { data: polls = [], isLoading, refetch } = useQuery({
    queryKey: ['active-polls'],
    queryFn: async () => {
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (
            id,
            option_text,
            display_order
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (pollsError) throw pollsError;

      // Get vote counts from our view
      const { data: voteCounts, error: voteCountError } = await supabase
        .from('poll_vote_counts')
        .select('*');

      if (voteCountError) throw voteCountError;

      // Get user's votes if authenticated
      const { data: userVotes, error: userVotesError } = profile?.id ? await supabase
        .from('poll_votes')
        .select('poll_id, option_id')
        .eq('user_id', profile.id) : { data: [], error: null };

      if (userVotesError) throw userVotesError;

      // Transform the data
      return (pollsData as Poll[]).map((poll): PollWithDetails => {
        const pollVoteCounts = (voteCounts as PollVoteCount[])?.filter(vc => vc.poll_id === poll.id) || [];
        const totalVotes = pollVoteCounts.reduce((sum, vc) => sum + (Number(vc.vote_count) || 0), 0);
        
        return {
          ...poll,
          poll_options: poll.poll_options.map(option => ({
            ...option,
            vote_count: pollVoteCounts.find(vc => vc.option_id === option.id)?.vote_count || 0,
            has_voted: userVotes?.some(uv => uv.option_id === option.id) || false
          })),
          total_votes: totalVotes
        };
      });
    },
    enabled: !!profile?.id
  });

  const handleDeletePoll = async (pollId: string) => {
    try {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (error) throw error;
      toast.success("Poll deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast.error("Failed to delete poll");
    }
  };

  const canManagePolls = profile?.is_member || profile?.is_admin;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Member Polls</h2>
        {canManagePolls && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading polls...</div>
      ) : polls.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No active polls</div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <PollCard 
              key={poll.id} 
              poll={poll}
              canEdit={canManagePolls}
              onDelete={() => handleDeletePoll(poll.id)}
            />
          ))}
        </div>
      )}

      <CreatePollDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
