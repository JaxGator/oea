import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventFilters } from "../../../types/filters";

interface AdditionalFiltersProps {
  filters: EventFilters;
  onFilterChange: (key: keyof EventFilters, value: any) => void;
}

export function AdditionalFilters({ filters, onFilterChange }: AdditionalFiltersProps) {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Filters</h4>
        <p className="text-sm text-muted-foreground">
          Customize your event search
        </p>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Filter by location..."
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="maxGuests">Maximum Guests</Label>
          <Input
            id="maxGuests"
            type="number"
            placeholder="Min capacity..."
            value={filters.maxGuests || ''}
            onChange={(e) => onFilterChange('maxGuests', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search events..."
            value={filters.searchTerm || ''}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}