
import { useEffect, useState } from "react";
import { LeaderboardTable } from "./LeaderboardTable";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { toast } from "sonner";

export function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState("month");
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        // Call the appropriate stored procedure based on time range
        let functionName = "get_monthly_leaderboard";
        if (timeRange === "week") {
          functionName = "get_weekly_leaderboard";
        } else if (timeRange === "year") {
          functionName = "get_yearly_leaderboard";
        } else if (timeRange === "all") {
          functionName = "get_all_time_leaderboard";
        }

        const { data, error } = await supabase.rpc(functionName as any);

        if (error) {
          throw error;
        }

        console.log(`Leaderboard data (${timeRange}):`, data);
        setMembers((data as any[]) || []);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast.error("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeRange]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Member Leaderboard</h1>
      <LeaderboardTable 
        data={members}
        category="attendance"
        timeFilter={timeRange === "week" ? "weekly" : timeRange === "month" ? "monthly" : "all"}
      />
    </div>
  );
}
