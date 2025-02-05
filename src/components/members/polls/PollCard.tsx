
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { PollOption } from "./components/PollOption";
import { PollVoterList } from "./PollVoterList";
import { Button } from "@/components/ui/button";
import { PollShareButton } from "./components/PollShareButton";
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
}

export function PollCard({ poll, canEdit, onDelete }: PollCardProps) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);
  const isMobile = useIsMobile();

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-lg font-semibold leading-none tracking-tight break-words">
                {poll.title}
              </h3>
              {poll.description && (
                <p className="text-sm text-muted-foreground break-words">{poll.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <PollShareButton pollId={poll.id} shareToken={poll.share_token} />
              {canEdit && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPieChart(!showPieChart)}
                    className="flex-shrink-0"
                  >
                    {showPieChart ? "Show Bars" : "Show Chart"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-destructive flex-shrink-0"
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
                {isMobile ? (
                  <Sheet>
                    <SheetTrigger asChild>
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
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[40vh]">
                      <SheetHeader>
                        <SheetTitle>Voters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        <PollVoterList voters={voters} />
                      </div>
                    </SheetContent>
                  </Sheet>
                ) : (
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
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
