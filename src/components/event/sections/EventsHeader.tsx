import { Button } from "@/components/ui/button";
import { CalendarDays, CalendarRange } from "lucide-react";
import { DateFilter } from "@/components/DateFilter";

interface EventsHeaderProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  isAuthenticated: boolean;
  onCreateEvent: () => void;
}

export function EventsHeader({
  selectedDate,
  onDateSelect,
  isAuthenticated,
  onCreateEvent,
}: EventsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <CalendarDays className="h-6 w-6" />
        Upcoming Events
      </h2>
      <div className="flex flex-wrap gap-4 w-full sm:w-auto">
        <DateFilter
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
        {isAuthenticated && (
          <Button 
            onClick={onCreateEvent}
            className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 w-full sm:w-auto"
          >
            Create Event
          </Button>
        )}
      </div>
    </div>
  );
}