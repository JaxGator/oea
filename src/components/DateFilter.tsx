import { Button } from "@/components/ui/button";
import { CalendarDays, CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateFilterProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function DateFilter({ selectedDate, onDateSelect }: DateFilterProps) {
  const getWeekendDateRange = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 6 is Saturday, 5 is Friday
    const friday = new Date(today);
    
    if (currentDay === 0) { // If Sunday, get the current weekend's Friday
      friday.setDate(today.getDate() - 2);
    } else if (currentDay >= 5) { // If already Friday or Saturday, use current Friday
      friday.setDate(today.getDate() - (currentDay - 5));
    } else { // If Monday-Thursday, get next Friday
      friday.setDate(today.getDate() + (5 - currentDay));
    }
    
    // Reset time to start of day
    friday.setHours(0, 0, 0, 0);
    return friday;
  };

  const dates = [
    { label: "Today", value: new Date() },
    { label: "This Weekend", value: getWeekendDateRange() },
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