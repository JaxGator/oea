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
type CategoryFilter = "attendance" | "hosting" | "contributions";

export function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("attendance");

  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ["leaderboard", timeFilter, categoryFilter],
    queryFn: async () => {
      console.log("Fetching leaderboard data with filters:", { timeFilter, categoryFilter });
      
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
        .gt('events_attended', 0); // Only show users who have attended events

      // Apply ordering based on category
      if (categoryFilter === "attendance") {
        query = query.order('events_attended', { ascending: false });
      } else if (categoryFilter === "hosting") {
        query = query.order('events_hosted', { ascending: false });
      } else {
        query = query.order('total_contributions', { ascending: false });
      }

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
      const filteredData = data.filter(item => {
        const hasMetrics = item.events_attended > 0 || 
                          item.events_hosted > 0 || 
                          item.total_contributions > 0;
        return hasMetrics;
      });

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
        <Tabs defaultValue="attendance" className="w-full" onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="hosting">Hosting</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
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
          <TabsContent value="hosting">
            <LeaderboardTable
              data={leaderboardData || []}
              category="hosting"
              timeFilter={timeFilter}
            />
          </TabsContent>
          <TabsContent value="contributions">
            <LeaderboardTable
              data={leaderboardData || []}
              category="contributions"
              timeFilter={timeFilter}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}