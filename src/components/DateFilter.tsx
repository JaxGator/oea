import { Button } from "@/components/ui/button";
import { CalendarDays, CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getUpcomingWeekendDate } from "@/utils/dateUtils";

interface DateFilterProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function DateFilter({ selectedDate, onDateSelect }: DateFilterProps) {
  const dates = [
    { label: "Today", value: new Date() },
    { label: "This Weekend", value: getUpcomingWeekendDate() },
  ];

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-[240px] justify-start text-left font-normal ${
              !selectedDate ? "text-muted-foreground" : ""
            }`}
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            {selectedDate ? (
              selectedDate.toLocaleDateString()
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        {dates.map((date) => (
          <Button
            key={date.label}
            variant="outline"
            className="gap-2"
            onClick={() => onDateSelect(date.value)}
          >
            <CalendarDays className="h-4 w-4" />
            {date.label}
          </Button>
        ))}
        {selectedDate && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onDateSelect(undefined)}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}