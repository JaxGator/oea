import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { getUpcomingWeekendDate } from "@/utils/dateUtils";

interface DateFilterButtonsProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function DateFilterButtons({ onDateSelect, selectedDate }: DateFilterButtonsProps) {
  const dates = [
    { label: "Today", value: new Date() },
    { label: "This Weekend", value: getUpcomingWeekendDate() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {dates.map((date) => (
        <Button
          key={date.label}
          variant="outline"
          className="gap-2 w-full sm:w-auto"
          onClick={() => onDateSelect(date.value)}
        >
          <CalendarDays className="h-4 w-4" />
          {date.label}
        </Button>
      ))}
      {selectedDate && (
        <Button
          variant="outline"
          className="gap-2 w-full sm:w-auto"
          onClick={() => onDateSelect(undefined)}
        >
          Clear
        </Button>
      )}
    </div>
  );
}