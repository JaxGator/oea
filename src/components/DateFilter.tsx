import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateFilterButtons } from "@/components/event/filters/DateFilterButtons";
import { fromZonedTime } from "date-fns-tz/fromZonedTime";

interface DateFilterProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function DateFilter({ selectedDate, onDateSelect }: DateFilterProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Convert the selected date to UTC while preserving the local date
      const localDate = fromZonedTime(date, timeZone);
      localDate.setHours(0, 0, 0, 0);
      onDateSelect(localDate);
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