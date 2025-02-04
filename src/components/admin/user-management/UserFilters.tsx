import { Button } from "@/components/ui/button";
import { UserFilters as UserFiltersType } from "../AdminUserList";

interface UserFiltersProps {
  filters: UserFiltersType;
  onFilterChange: (filters: UserFiltersType) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  const toggleFilter = (key: keyof UserFiltersType) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key]
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={filters.isAdmin ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("isAdmin")}
        className="flex-1 min-w-[100px] max-w-[150px] h-8"
      >
        Admins
      </Button>
      <Button
        variant={filters.isApproved ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("isApproved")}
        className="flex-1 min-w-[100px] max-w-[150px] h-8"
      >
        Approved
      </Button>
      <Button
        variant={filters.isMember ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("isMember")}
        className="flex-1 min-w-[100px] max-w-[150px] h-8"
      >
        Members
      </Button>
    </div>
  );
}