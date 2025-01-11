import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeaderboardTableProps {
  data: any[];
  category: "attendance" | "hosting" | "contributions";
  timeFilter: "all" | "monthly" | "weekly";
}

export function LeaderboardTable({
  data,
  category,
  timeFilter,
}: LeaderboardTableProps) {
  console.log("LeaderboardTable render:", { data, category, timeFilter });

  const getMetricValue = (item: any) => {
    if (timeFilter === "weekly") {
      return item.weekly_points || 0;
    }
    if (timeFilter === "monthly") {
      return item.monthly_points || 0;
    }
    switch (category) {
      case "attendance":
        return item.events_attended || 0;
      case "hosting":
        return item.events_hosted || 0;
      case "contributions":
        return item.total_contributions || 0;
      default:
        return 0;
    }
  };

  const getMetricLabel = () => {
    switch (category) {
      case "attendance":
        return "Events Attended";
      case "hosting":
        return "Events Hosted";
      case "contributions":
        return "Total Contributions";
      default:
        return "Score";
    }
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
          <TableHead>Member</TableHead>
          <TableHead className="text-right">{getMetricLabel()}</TableHead>
          <TableHead className="text-right">Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>
              {index < 3 ? (
                <Trophy
                  className={
                    index === 0
                      ? "text-yellow-500"
                      : index === 1
                      ? "text-gray-400"
                      : "text-amber-600"
                  }
                />
              ) : (
                index + 1
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={item.profiles?.avatar_url}
                    alt={item.profiles?.username}
                  />
                  <AvatarFallback>
                    <UserCircle className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{item.profiles?.username || 'Unknown User'}</div>
                  <div className="text-sm text-gray-500">
                    {item.profiles?.full_name || ''}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary">{getMetricValue(item)}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {item.current_streak > 0 && (
                <Badge variant="outline">🔥 {item.current_streak}</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}