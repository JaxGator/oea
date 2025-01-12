import type { UserFilters as UserFiltersType } from "../AdminUserList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
      <h3 className="font-medium mb-4">Filter Members</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="admin-filter"
            checked={filters.isAdmin}
            onCheckedChange={() => handleFilterChange('isAdmin')}
          />
          <Label htmlFor="admin-filter">Admins</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="approved-filter"
            checked={filters.isApproved}
            onCheckedChange={() => handleFilterChange('isApproved')}
          />
          <Label htmlFor="approved-filter">Approved</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="member-filter"
            checked={filters.isMember}
            onCheckedChange={() => handleFilterChange('isMember')}
          />
          <Label htmlFor="member-filter">Members</Label>
        </div>
      </div>
    </Card>
  );
}