import { Event } from "@/types/event";

interface EventInfoWindowProps {
  event: Event;
}

export function EventInfoWindow({ event }: EventInfoWindowProps) {
  return (
    <div className="p-2">
      <h3 className="font-semibold">{event.title}</h3>
      <p className="text-sm">{event.location}</p>
      <p className="text-sm">{event.date} at {event.time}</p>
    </div>
  );
}