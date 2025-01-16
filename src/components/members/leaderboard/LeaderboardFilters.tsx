import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch, SetStateAction } from "react";

interface Filters {
  isAdmin: boolean;
  isApproved: boolean;
  isMember: boolean;
}

interface LeaderboardFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  timeFilter: "all" | "monthly" | "weekly";
  onTimeFilterChange: Dispatch<SetStateAction<"all" | "monthly" | "weekly">>;
}

export function LeaderboardFilters({ 
  filters, 
  onFilterChange,
  timeFilter,
  onTimeFilterChange 
}: LeaderboardFiltersProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.isAdmin}
            onCheckedChange={(checked) => 
              onFilterChange({ ...filters, isAdmin: checked as boolean })}
          />
          <span>Admins</span>
        </label>
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.isApproved}
            onCheckedChange={(checked) => 
              onFilterChange({ ...filters, isApproved: checked as boolean })}
          />
          <span>Approved</span>
        </label>
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={filters.isMember}
            onCheckedChange={(checked) => 
              onFilterChange({ ...filters, isMember: checked as boolean })}
          />
          <span>Members</span>
        </label>
      </div>
    </div>
  );
}