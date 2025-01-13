import { Event } from "@/types/event";

interface EventCardBasicInfoProps {
  event: Event;
}

export function EventCardBasicInfo({ event }: EventCardBasicInfoProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      {event.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      )}
    </div>
  );
}