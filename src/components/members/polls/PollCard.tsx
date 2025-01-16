import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartBar, Check } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
    }>;
  };
}

export function PollCard({ poll }: PollCardProps) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [isVoting, setIsVoting] = useState(false);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{poll.title}</h3>
          <ChartBar className="h-5 w-5 text-muted-foreground" />
        </div>
        {poll.description && (
          <p className="text-sm text-muted-foreground">{poll.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.poll_options.map((option) => {
          const percentage = getVotePercentage(option.id);
          const isSelected = userVote?.option_id === option.id;

          return (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start gap-2"
                  disabled={!!userVote || isVoting}
                  onClick={() => handleVote(option.id)}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                  {option.option_text}
                </Button>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-sm text-muted-foreground text-right">
                {percentage.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}