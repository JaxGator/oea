
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { PollHeader } from "./components/PollHeader";
import { PollChartView } from "./components/PollChartView";
import { PollOption } from "./components/PollOption";
import { PollVoterList } from "./PollVoterList";
import { Button } from "@/components/ui/button";
import { PollShareButton } from "./components/PollShareButton";

interface PollCardProps {
  poll: {
    id: string;
    title: string;
    description: string | null;
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
}

export function PollCard({ poll, canEdit, onDelete }: PollCardProps) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);

  const userVote = poll.poll_votes.find(vote => vote.user_id === user?.id);
  const totalVotes = poll.poll_votes.length;

  const handleVote = async (optionId: string) => {
    if (!user) {
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
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record vote");
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (optionId: string) => {
    if (totalVotes === 0) return 0;
    const optionVotes = poll.poll_votes.filter(vote => vote.option_id === optionId).length;
    return (optionVotes / totalVotes) * 100;
  };

  const getVotersForOption = (optionId: string) => {
    return poll.poll_votes.filter(vote => vote.option_id === optionId);
  };

  const pieChartData = poll.poll_options.map((option) => ({
    name: option.option_text,
    value: getVotersForOption(option.id).length
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {poll.title}
            </h3>
            {poll.description && (
              <p className="text-sm text-muted-foreground">{poll.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <>
                <PollShareButton pollId={poll.id} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPieChart(!showPieChart)}
                >
                  {showPieChart ? "Show Bars" : "Show Chart"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-destructive"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPieChart ? (
          <PollChartView data={pieChartData} />
        ) : (
          poll.poll_options.map((option) => {
            const percentage = getVotePercentage(option.id);
            const isSelected = userVote?.option_id === option.id;
            const voters = getVotersForOption(option.id);

            return (
              <div key={option.id}>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div>
                      <PollOption
                        optionText={option.option_text}
                        isSelected={isSelected}
                        percentage={percentage}
                        votesCount={voters.length}
                        disabled={!!userVote || isVoting}
                        onVote={() => handleVote(option.id)}
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent align="end" className="w-64">
                    <PollVoterList voters={voters} />
                  </HoverCardContent>
                </HoverCard>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
