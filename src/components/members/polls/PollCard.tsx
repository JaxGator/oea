
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PollCardHeader } from "./components/PollCardHeader";
import { PollOptionsList } from "./components/PollOptionsList";
import { PollChartView } from "./components/PollChartView";

interface PollCardProps {
  poll: {
    id: string;
    title: string;
    description: string | null;
    share_token: string;
    poll_options: Array<{
      id: string;
      option_text: string;
    }>;
    poll_votes: Array<{
      id: string;
      option_id: string;
      user_id: string;
      profiles: {
        username: string;
        avatar_url: string | null;
      } | null;
    }>;
  };
  canEdit: boolean;
  onDelete: () => void;
  isPublicView?: boolean;
}

export function PollCard({ poll, canEdit, onDelete, isPublicView = false }: PollCardProps) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);

  const userVote = poll.poll_votes.find(vote => vote.user_id === user?.id)?.option_id;
  const totalVotes = poll.poll_votes.length;

  const handleVote = async (optionId: string) => {
    if (!user || isPublicView) {
      toast.error("Please sign in to vote");
      return;
    }

    setIsVoting(true);
    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert({
          poll_id: poll.id,
          option_id: optionId,
          user_id: user.id
        });

      if (error) throw error;

      toast.success("Vote recorded successfully!");
      queryClient.invalidateQueries({ queryKey: ['active-polls'] });
      queryClient.invalidateQueries({ queryKey: ['shared-poll'] });
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record vote");
    } finally {
      setIsVoting(false);
    }
  };

  const pieChartData = poll.poll_options.map((option) => ({
    name: option.option_text,
    value: poll.poll_votes.filter(vote => vote.option_id === option.id).length
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <PollCardHeader
          title={poll.title}
          description={poll.description}
          totalVotes={totalVotes}
          canEdit={canEdit}
          showPieChart={showPieChart}
          shareToken={poll.share_token}
          pollId={poll.id}
          onDelete={onDelete}
          onToggleChart={() => setShowPieChart(!showPieChart)}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {showPieChart ? (
          <PollChartView data={pieChartData} />
        ) : (
          <PollOptionsList
            options={poll.poll_options}
            userVote={userVote}
            isVoting={isVoting}
            isPublicView={isPublicView}
            voters={poll.poll_votes}
            onVote={handleVote}
          />
        )}
      </CardContent>
    </Card>
  );
}
