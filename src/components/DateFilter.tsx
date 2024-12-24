import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import { AdditionalFilters } from "./event/filters/AdditionalFilters";
import { EventFilters, defaultFilters } from "@/types/filters";

interface DateFilterProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  onFiltersChange?: (filters: EventFilters) => void;
  filters?: Partial<EventFilters>;
}

export function DateFilter({ 
  selectedDate, 
  onDateSelect, 
  onFiltersChange, 
  filters = defaultFilters 
}: DateFilterProps) {
  const now = new Date();
  const dates = [
    { label: "All", date: null },
    { label: "Today", date: now },
    { label: "This Weekend", date: new Date(now.getTime() + (6 - now.getDay()) * 24 * 60 * 60 * 1000) },
    { label: "This Month", date: new Date(now.getFullYear(), now.getMonth() + 1, 0) },
  ];

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    if (onFiltersChange) {
      onFiltersChange({
        ...filters,
        [key]: value,
      } as EventFilters);
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
            <AdditionalFilters
              filters={filters as EventFilters}
              onFilterChange={handleFilterChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}