
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { PollCardHeader } from "./components/PollCardHeader";
import { PollOptionsList } from "./components/PollOptionsList";
import { PollChartView } from "./components/PollChartView";
import type { PollWithDetails, VoteResult } from "@/types/database.types";
import { executeQuery } from "@/utils/database";

interface PollCardProps {
  poll: PollWithDetails;
  canEdit: boolean;
  onDelete: () => void;
  isPublicView?: boolean;
}

export function PollCard({ poll, canEdit, onDelete, isPublicView = false }: PollCardProps) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);

  const userVote = poll.poll_options.find(option => option.has_voted)?.id;

  const handleVote = async (optionId: string) => {
    if (!user || isPublicView) {
      toast.error("Please sign in to vote");
      return;
    }

    setIsVoting(true);
    try {
      const { data: result, error } = await executeQuery<VoteResult>(() =>
        supabase.rpc('handle_poll_vote', {
          p_poll_id: poll.id,
          p_option_id: optionId,
          p_user_id: user.id
        })
      );

      if (error) throw error;

      switch (result) {
        case 'success':
          toast.success("Vote recorded successfully!");
          break;
        case 'already_voted':
          toast.error("You have already voted in this poll");
          break;
        case 'poll_closed':
          toast.error("This poll is closed");
          break;
        case 'not_found':
          toast.error("Poll not found");
          break;
        default:
          toast.error("An unexpected error occurred");
      }

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
    value: option.vote_count || 0
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <PollCardHeader
          title={poll.title}
          description={poll.description ?? undefined}
          totalVotes={poll.total_votes ?? 0}
          canEdit={canEdit}
          showPieChart={showPieChart}
          shareToken={poll.share_token ?? undefined}
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
            voters={[]}
            onVote={handleVote}
          />
        )}
      </CardContent>
    </Card>
  );
}
