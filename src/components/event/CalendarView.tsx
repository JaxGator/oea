import { Calendar } from "@/components/ui/calendar";
import { Event } from "@/types/event";
import { useState } from "react";

interface CalendarViewProps {
  events: Event[];
  onDateSelect: (date: Date | undefined) => void;
}

export function CalendarView({ events, onDateSelect }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSelect = (date: Date | undefined) => {
    setDate(date);
    onDateSelect(date);
  };

  // Create an array of dates that have events
  const eventDates = events.map(event => new Date(event.date));

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <div className="max-w-full mx-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="w-full rounded-md border"
          modifiers={{ event: eventDates }}
          modifiersStyles={{
            event: { fontWeight: 'bold', backgroundColor: '#E0F2FE' }
          }}
        />
      </div>
    </div>
  );
}