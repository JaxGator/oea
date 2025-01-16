import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, ChartBar, Check, X } from "lucide-react";
import { CreatePollDialog } from "./CreatePollDialog";
import { PollCard } from "./PollCard";
import { useAuthState } from "@/hooks/useAuthState";

export function PollSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { profile } = useAuthState();

  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['active-polls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select(`
          *,
          poll_options (
            id,
            option_text,
            display_order
          ),
          poll_votes (
            id,
            option_id,
            user_id
          ),
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const canCreatePolls = profile?.is_member || profile?.is_admin;

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Community Polls</h2>
        {canCreatePolls && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Poll
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading polls...</div>
      ) : polls.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No active polls at the moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
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