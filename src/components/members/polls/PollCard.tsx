import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, PieChart, Check, Edit, Trash, Users } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{poll.title}</h3>
            {poll.description && (
              <p className="text-sm text-muted-foreground">{poll.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPieChart(!showPieChart)}
            >
              {showPieChart ? <BarChart className="h-4 w-4" /> : <PieChart className="h-4 w-4" />}
            </Button>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Users className="h-4 w-4" />
                  <span className="ml-1">{totalVotes}</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <h4 className="mb-2 font-semibold">Total Votes: {totalVotes}</h4>
                {poll.poll_options.map((option) => (
                  <div key={option.id} className="mb-4">
                    <h5 className="font-medium mb-2">{option.option_text}</h5>
                    <div className="space-y-2">
                      {getVotersForOption(option.id).map((vote) => (
                        <div key={vote.id} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={vote.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              {vote.profiles ? getInitials(vote.profiles.username) : '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{vote.profiles?.username || 'Unknown User'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPieChart ? (
          <div className="h-[300px] w-full flex justify-center">
            <RechartsPieChart width={300} height={300}>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </div>
        ) : (
          poll.poll_options.map((option) => {
            const percentage = getVotePercentage(option.id);
            const isSelected = userVote?.option_id === option.id;
            const voters = getVotersForOption(option.id);

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
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{voters.length} votes</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}