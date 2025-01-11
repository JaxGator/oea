import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardFilters } from "./LeaderboardFilters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type TimeFilter = "all" | "monthly" | "weekly";

export function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ["leaderboard", timeFilter],
    queryFn: async () => {
      console.log("Fetching leaderboard data with filters:", { timeFilter });
      
      let query = supabase
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

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching leaderboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Raw leaderboard data received:", data);
      
      // Filter out users with no metrics
      const filteredData = data.filter(item => item.events_attended > 0);

      console.log("Filtered leaderboard data:", filteredData);
      return filteredData;
    },
  });

  if (error) {
    console.error("Leaderboard error:", error);
    return (
      <div className="p-4 text-red-500">
        Error loading leaderboard data. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Member Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <LeaderboardFilters
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
            />
          </div>
          <TabsContent value="attendance">
            <LeaderboardTable
              data={leaderboardData || []}
              category="attendance"
              timeFilter={timeFilter}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}