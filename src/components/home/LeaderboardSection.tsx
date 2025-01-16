import { Link } from "react-router-dom";
import { LeaderboardTable } from "@/components/members/leaderboard/LeaderboardTable";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function LeaderboardSection() {
  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard-preview"],
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
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Leaderboard</h2>
          <Link
            to="/users"
            className="text-primary hover:text-primary/90 font-medium"
          >
            View All Users
          </Link>
        </div>
        
        <Card className="p-6">
          <LeaderboardTable 
            data={leaderboardData || []}
            category="attendance"
            timeFilter="all"
            limit={5}
          />
        </Card>
      </div>
    </section>
  );
}