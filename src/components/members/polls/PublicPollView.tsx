
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PollCard } from "./PollCard";

export function PublicPollView() {
  const { token } = useParams();

  const { data: poll, isLoading, error } = useQuery({
    queryKey: ['shared-poll', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          id,
          title,
          description,
          share_token,
          poll_options (
            id,
            option_text
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
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token
  });

  if (isLoading) {
    return <div className="p-8 text-center">Loading poll...</div>;
  }

  if (error || !poll) {
    return <div className="p-8 text-center text-red-500">Poll not found or no longer active</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <PollCard 
        poll={poll}
        canEdit={false}
        onDelete={() => {}}
      />
    </div>
  );
}
