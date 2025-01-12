import { format, parseISO } from "date-fns";
import { EventDetails } from "../EventDetails";
import { EventShareMenu } from "../share/EventShareMenu";
import { AddToCalendar } from "../AddToCalendar";

interface EventMetadataProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
  };
  canAddToCalendar: boolean;
  isPastEvent: boolean;
}

export function EventMetadata({ event, canAddToCalendar, isPastEvent }: EventMetadataProps) {
  return (
    <div className="flex-1 space-y-6">
      <div className="relative w-full aspect-video">
        <img
          src={event.image_url}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <h2 className="text-2xl font-bold">{event.title}</h2>
      
      <EventDetails
        date={event.date}
        time={event.time}
        location={event.location}
        description={event.description || ""}
        showFullDescription
      />
      
      {canAddToCalendar && !isPastEvent && (
        <AddToCalendar
          event={{
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
          }}
        />
      )}
      
      <EventShareMenu eventId={event.id} title={event.title} />
    </div>
  );
}