
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";

interface EventParticipationFiltersProps {
  dateRange: DateRange | undefined;
  eventType: string;
  onDateRangeChange: (newDateRange: DateRange | undefined) => void;
  onEventTypeChange: (value: string) => void;
  onExport: () => void;
}

export function EventParticipationFilters({
  dateRange,
  eventType,
  onDateRangeChange,
  onEventTypeChange,
  onExport
}: EventParticipationFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <DatePickerWithRange
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Select value={eventType} onValueChange={onEventTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={onExport} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
}
