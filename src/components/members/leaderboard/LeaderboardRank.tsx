import { Trophy } from "lucide-react";

interface LeaderboardRankProps {
  rank: number;
}

export function LeaderboardRank({ rank }: LeaderboardRankProps) {
  if (rank < 3) {
    return (
      <Trophy
        className={
          rank === 0
            ? "text-yellow-500"
            : rank === 1
            ? "text-gray-400"
            : "text-amber-600"
        }
      />
    );
  }
  return <span>{rank + 1}</span>;
}