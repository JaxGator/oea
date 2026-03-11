
import { Link } from "react-router-dom";
import { LeaderboardTable } from "@/components/members/leaderboard/LeaderboardTable";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function LeaderboardSection() {
  const { toast } = useToast();
  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ["leaderboard-preview"],
    queryFn: async () => {
      console.log('Fetching leaderboard data...');
      try {
        const { data, error } = await supabase
          .from("leaderboard_metrics" as any)
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url,
              full_name,
              is_admin,
              is_approved,
              is_member,
              created_at,
              event_reminders_enabled,
              email,
              email_notifications,
              in_app_notifications,
              interests,
              updated_at,
              leaderboard_opt_out
            )
          `)
          .gt('events_attended', 0)
          .order('events_attended', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching leaderboard:', error);
          throw error;
        }
        
        // Filter out any entries that don't have associated profile data
        const filteredData = (data as any[])?.filter((item: any) => item.profiles && item.profiles.username) || [];
        console.log('Filtered leaderboard data:', filteredData);
        
        return filteredData;
      } catch (error) {
        console.error('Leaderboard error:', error);
        toast({
          title: "Error loading leaderboard",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000)
  });

  if (error) {
    console.error('Leaderboard error:', error);
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-black" />
            <h2 className="text-xl sm:text-2xl font-bold">Leaderboard</h2>
          </div>
          <Button 
            variant="outline"
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white border-[#0d97d1] hover:border-[#0d97d1]/90 whitespace-nowrap"
            asChild
          >
            <Link to="/users">
              View All
            </Link>
          </Button>
        </div>
        
        <Card className="p-4 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle">
              <LeaderboardTable 
                data={leaderboardData || []}
                category="attendance"
                timeFilter="all"
                limit={5}
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
