import { Badge } from "@/components/ui/badge";

interface LeaderboardMetricsProps {
  eventsAttended: number;
  currentStreak: number;
}

export function LeaderboardMetrics({ eventsAttended, currentStreak }: LeaderboardMetricsProps) {
  return (
    <>
      <td className="text-right">
        <Badge variant="secondary">{eventsAttended}</Badge>
      </td>
      <td className="text-right">
        {currentStreak > 0 ? (
          <Badge variant="outline" className="font-medium">
            🔥 {currentStreak} event{currentStreak !== 1 ? 's' : ''} in a row
          </Badge>
        ) : (
          <span className="text-gray-500 text-sm">No active streak</span>
        )}
      </td>
    </>
  );
}