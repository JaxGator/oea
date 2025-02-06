
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PollCard } from "./PollCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PublicPollView() {
  const { token } = useParams();
  const { user } = useAuthState();
  const navigate = useNavigate();

  const { data: poll, isLoading, error } = useQuery({
    queryKey: ['shared-poll', token],
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
          share_token,
          visibility,
          poll_options (
            id,
            option_text,
            display_order
          ),
          poll_votes (
            id,
            option_id,
            user_id,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
        .eq('share_token', token)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error('Poll not found');
      }

      return {
        ...data,
        poll_votes: data.poll_votes.map((vote: any) => ({
          id: vote.id,
          option_id: vote.option_id,
          user_id: vote.user_id,
          profiles: vote.profiles || { username: '', avatar_url: null }
        }))
      };
    },
    enabled: !!token
  });

  const handleAuthClick = () => {
    navigate('/auth', { state: { returnPath: `/polls/share/${token}` } });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert>
          <AlertDescription>Loading poll...</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert variant="destructive">
          <AlertDescription>
            {error ? 'Error loading poll' : 'Poll not found or no longer active'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
      {!user && (
        <div className="flex justify-center mb-4">
          <Button onClick={handleAuthClick} className="gap-2">
            <LogIn className="w-4 h-4" />
            Sign in to vote
          </Button>
        </div>
      )}
      <PollCard 
        poll={poll}
        canEdit={false}
        onDelete={() => {}}
        isPublicView={!user}
      />
    </div>
  );
}
