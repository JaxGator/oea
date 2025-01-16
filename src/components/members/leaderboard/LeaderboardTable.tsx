import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardRank } from "./LeaderboardRank";
import { LeaderboardUserCell } from "./LeaderboardUserCell";
import { LeaderboardMetrics } from "./LeaderboardMetrics";

interface LeaderboardTableProps {
  data: any[];
  category: "attendance";
  timeFilter: "all" | "monthly" | "weekly";
}

export function LeaderboardTable({
  data,
  timeFilter,
}: LeaderboardTableProps) {
  console.log("LeaderboardTable render:", { data, timeFilter });

  const getMetricValue = (item: any) => {
    if (timeFilter === "weekly") {
      return item.weekly_points || 0;
    }
    if (timeFilter === "monthly") {
      return item.monthly_points || 0;
    }
    return item.events_attended || 0;
  };

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No leaderboard data available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Events Attended</TableHead>
          <TableHead className="text-right">Current Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>
              <LeaderboardRank rank={index} />
            </TableCell>
            <TableCell>
              <LeaderboardUserCell
                avatarUrl={item.profiles?.avatar_url}
                username={item.profiles?.username || 'Unknown User'}
                fullName={item.profiles?.full_name}
              />
            </TableCell>
            <LeaderboardMetrics
              eventsAttended={getMetricValue(item)}
              currentStreak={item.current_streak}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}