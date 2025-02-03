import { Badge } from "@/components/ui/badge";

interface LeaderboardMetricsProps {
  eventsAttended: number;
  currentStreak: number;
}

export function LeaderboardMetrics({ eventsAttended, currentStreak }: LeaderboardMetricsProps) {
  return (
    <>
      <td className="text-right">
        <Badge variant="secondary" className="font-medium">
          {eventsAttended}
        </Badge>
      </td>
      <td className="text-right hidden sm:table-cell">
        {currentStreak > 0 ? (
          <Badge variant="outline" className="font-medium whitespace-nowrap">
            🔥 {currentStreak} event{currentStreak !== 1 ? 's' : ''} in a row
          </Badge>
        ) : (
          <span className="text-sm text-gray-500">No streak</span>
        )}
      </td>
    </>
  );
}