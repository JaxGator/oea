import { Event } from "@/types/event";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

interface EventCalendarViewProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
}

export function EventCalendarView({ events, onEventClick }: EventCalendarViewProps) {
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    classNames: [
      event.is_featured ? 'featured-event' : '',
      'cursor-pointer hover:opacity-90'
    ]
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventClick={(info) => onEventClick(info.event.id)}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
      />
    </div>
  );
}