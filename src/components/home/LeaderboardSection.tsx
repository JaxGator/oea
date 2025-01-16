import { useAuthState } from "@/hooks/useAuthState";
import { LeaderboardTable } from "@/components/members/leaderboard/LeaderboardTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function LeaderboardSection() {
  const { profile, isAuthenticated } = useAuthState();

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leaderboard_metrics")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            full_name
          )
        `)
        .gt('events_attended', 0)
        .order('events_attended', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && profile?.is_approved
  });

  if (!isAuthenticated || !profile?.is_approved) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Leaderboard
        </h2>
        <Link to="/users">
          <Button variant="outline">View All Users</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Contributors</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <LeaderboardTable
              data={leaderboardData || []}
              category="attendance"
              timeFilter="all"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}