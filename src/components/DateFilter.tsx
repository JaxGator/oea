import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateFilterButtons } from "@/components/event/filters/DateFilterButtons";
import { startOfDay } from "date-fns";

interface DateFilterProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function DateFilter({ selectedDate, onDateSelect }: DateFilterProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Normalize the date to start of day in local timezone
      const normalizedDate = startOfDay(date);
      onDateSelect(normalizedDate);
    } else {
      onDateSelect(undefined);
    }
  };

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
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <DateFilterButtons
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}