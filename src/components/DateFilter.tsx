import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, SlidersHorizontal } from "lucide-react";

interface DateFilterProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  onFiltersChange?: (filters: EventFilters) => void;
  filters?: Partial<EventFilters>;
}

export interface EventFilters {
  date: Date | null;
  location?: string;
  maxGuests?: number;
  searchTerm?: string;
}

export function DateFilter({ selectedDate, onDateSelect, onFiltersChange, filters = { date: null } }: DateFilterProps) {
  const now = new Date();
  const dates = [
    { label: "All", date: null },
    { label: "Today", date: now },
    { label: "This Weekend", date: endOfWeek(now, { weekStartsOn: 6 }) },
    { label: "This Month", date: endOfMonth(now) },
  ];

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        [key]: value,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {dates.map((item) => (
          <Button
            key={item.label}
            variant={selectedDate === item.date ? "default" : "outline"}
            className={`whitespace-nowrap ${
              selectedDate === item.date
                ? "bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)]"
                : "hover:bg-[var(--button-primary-hover)]/10"
            }`}
            onClick={() => {
              onDateSelect(item.date);
              handleFilterChange('date', item.date);
            }}
          >
            {item.label}
          </Button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              More Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your event search
                </p>
              </div>
              <Separator />
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Filter by location..."
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="maxGuests">Maximum Guests</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    placeholder="Min capacity..."
                    value={filters.maxGuests || ''}
                    onChange={(e) => handleFilterChange('maxGuests', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search events..."
                    value={filters.searchTerm || ''}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}