
import { Event } from "@/types/event";
import { EventImageSection } from "../EventImageSection";

interface EventDetailedHeaderProps {
  event: Event;
}

export function EventDetailedHeader({ event }: EventDetailedHeaderProps) {
  return (
    <div className="animate-fade-in">
      <EventImageSection imageUrl={event.image_url} title={event.title} />
    </div>
  );
}
