import { Link } from "react-router-dom";
import { LeaderboardTable } from "@/components/members/leaderboard/LeaderboardTable";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/hooks/useAuthState";

export function LeaderboardSection() {
  const { isAuthenticated } = useAuthState();
  
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
    enabled: true // Always fetch data, even for logged-out users
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-black" />
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>
          <Button 
            variant="outline"
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white border-[#0d97d1] hover:border-[#0d97d1]/90"
            asChild
          >
            <Link to="/users">
              View All Users
            </Link>
          </Button>
        </div>
        
        <Card className="p-6">
          <LeaderboardTable 
            data={leaderboardData || []}
            category="attendance"
            timeFilter="all"
            limit={5}
          />
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600">Sign in to participate in the leaderboard!</p>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}