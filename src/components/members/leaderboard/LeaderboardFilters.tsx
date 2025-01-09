import { Button } from "@/components/ui/button";

interface LeaderboardFiltersProps {
  timeFilter: "all" | "monthly" | "weekly";
  onTimeFilterChange: (filter: "all" | "monthly" | "weekly") => void;
}

export function LeaderboardFilters({
  timeFilter,
  onTimeFilterChange,
}: LeaderboardFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={timeFilter === "all" ? "default" : "outline"}
        onClick={() => onTimeFilterChange("all")}
      >
        All Time
      </Button>
      <Button
        variant={timeFilter === "monthly" ? "default" : "outline"}
        onClick={() => onTimeFilterChange("monthly")}
      >
        Monthly
      </Button>
      <Button
        variant={timeFilter === "weekly" ? "default" : "outline"}
        onClick={() => onTimeFilterChange("weekly")}
      >
        Weekly
      </Button>
    </div>
  );
}