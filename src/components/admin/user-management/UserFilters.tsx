import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { UserFilters as UserFiltersType } from "../AdminUserList";

interface UserFiltersProps {
  filters: UserFiltersType;
  onFilterChange: (filters: UserFiltersType) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  const handleFilterChange = (key: keyof UserFiltersType) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-6">
        <h3 className="font-medium whitespace-nowrap">Filter Members:</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin-filter"
              checked={filters.isAdmin}
              onCheckedChange={() => handleFilterChange('isAdmin')}
            />
            <Label htmlFor="admin-filter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Admins
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="approved-filter"
              checked={filters.isApproved}
              onCheckedChange={() => handleFilterChange('isApproved')}
            />
            <Label htmlFor="approved-filter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Approved
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="member-filter"
              checked={filters.isMember}
              onCheckedChange={() => handleFilterChange('isMember')}
            />
            <Label htmlFor="member-filter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Members
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
}