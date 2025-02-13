
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
import { createMemberFromPartial } from "../types";

interface LeaderboardTableProps {
  data: any[];
  category: "attendance";
  timeFilter: "all" | "monthly" | "weekly";
  limit?: number;
}

export function LeaderboardTable({
  data,
  timeFilter,
  limit
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

  const displayData = limit ? data.slice(0, limit) : data;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Events</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Streak</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <LeaderboardRank rank={index} />
              </TableCell>
              <TableCell>
                <LeaderboardUserCell
                  user={createMemberFromPartial({
                    id: item.id,
                    username: item.profiles?.username || 'Unknown User',
                    full_name: item.profiles?.full_name,
                    avatar_url: item.profiles?.avatar_url,
                    is_admin: item.profiles?.is_admin || false,
                    is_approved: item.profiles?.is_approved || false,
                    is_member: item.profiles?.is_member || false,
                    created_at: item.profiles?.created_at || new Date().toISOString(),
                    event_reminders_enabled: item.profiles?.event_reminders_enabled || false,
                    email: item.profiles?.email || null,
                    email_notifications: item.profiles?.email_notifications || false,
                    in_app_notifications: item.profiles?.in_app_notifications || false,
                    interests: item.profiles?.interests || null,
                    updated_at: item.profiles?.updated_at || null,
                    leaderboard_opt_out: item.profiles?.leaderboard_opt_out || false
                  })}
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
    </div>
  );
}
