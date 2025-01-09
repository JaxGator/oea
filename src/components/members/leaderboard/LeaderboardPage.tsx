import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardTable } from "./LeaderboardTable";
import { LeaderboardFilters } from "./LeaderboardFilters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

type TimeFilter = "all" | "monthly" | "weekly";
type CategoryFilter = "attendance" | "hosting" | "contributions";

export function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("attendance");

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard", timeFilter, categoryFilter],
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
        .order(
          categoryFilter === "attendance"
            ? "events_attended"
            : categoryFilter === "hosting"
            ? "events_hosted"
            : "total_contributions",
          { ascending: false }
        );

      if (error) throw error;
      return data;
    },
  });

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