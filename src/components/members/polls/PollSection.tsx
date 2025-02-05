
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PollCard } from "./PollCard";
import { CreatePollDialog } from "./CreatePollDialog";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PollVote {
  id: string;
  user_id: string;
  option_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface PollOption {
  id: string;
  option_text: string;
  display_order: number;
}

interface Poll {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  status: 'draft' | 'active' | 'closed';
  start_date: string | null;
  end_date: string | null;
  allow_multiple_choices: boolean;
  created_at: string;
  share_token: string;
  poll_options: PollOption[];
  poll_votes: PollVote[];
}

export function PollSection() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { profile } = useAuthState();

  const { data: polls = [], isLoading, refetch } = useQuery({
    queryKey: ['active-polls'],
    queryFn: async () => {
      const { data: ownAndSharedPolls, error: pollsError } = await supabase
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
          share_token,
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

      if (pollsError) throw pollsError;
      
      return (ownAndSharedPolls as any[]).map((poll): Poll => ({
        ...poll,
        poll_votes: poll.poll_votes.map((vote: any) => ({
          ...vote,
          profiles: vote.profiles || { username: '', avatar_url: null }
        }))
      }));
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
