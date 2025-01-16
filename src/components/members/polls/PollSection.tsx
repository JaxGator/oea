import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PollCard } from "./PollCard";
import { CreatePollDialog } from "./CreatePollDialog";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function PollSection() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { profile } = useAuthState();

  const { data: polls = [], isLoading, refetch } = useQuery({
    queryKey: ['active-polls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          id,
          title,
          description,
          created_by,
          status,
          start_date,
          end_date,
          allow_multiple_choices,
          created_at,
          poll_options (
            id,
            option_text,
            display_order
          ),
          poll_votes (
            id,
            user_id,
            option_id,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected types
      return data.map(poll => ({
        id: poll.id,
        title: poll.title,
        description: poll.description,
        poll_options: poll.poll_options.map(option => ({
          id: option.id,
          option_text: option.option_text
        })),
        poll_votes: poll.poll_votes.map(vote => ({
          id: vote.id,
          option_id: vote.option_id,
          user_id: vote.user_id,
          profiles: vote.profiles
        }))
      }));
    }
  });

  const handleDeletePoll = async (pollId: string) => {
    try {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (error) throw error;
      toast({
        title: "Poll deleted successfully",
        variant: "default"
      });
      refetch();
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({
        title: "Failed to delete poll",
        variant: "destructive"
      });
    }
  };

  // Now both members and admins can create polls
  const canManagePolls = profile?.is_member || profile?.is_admin;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Member Polls</h2>
        {canManagePolls && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
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