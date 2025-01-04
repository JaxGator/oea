import { CalendarDays, MapPin, Users } from "lucide-react";
import { format, parseISO } from "date-fns";

interface EventCardBasicInfoProps {
  date: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
}

export function EventCardBasicInfo({
  date,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
}: EventCardBasicInfoProps) {
  return (
    <div className="space-y-2">
      <div 
        className="flex items-center gap-2 text-gray-600"
        role="group"
        aria-label="Event date"
        tabIndex={0}
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        <span>{format(parseISO(date), "MMMM d, yyyy")}</span>
      </div>
      
      <div 
        className="flex items-center gap-2 text-gray-600"
        role="group"
        aria-label="Event location"
        tabIndex={0}
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        <span>{location}</span>
      </div>
      
      <div 
        className="flex items-center gap-2 text-gray-600"
        role="group"
        aria-label="Event attendance"
        tabIndex={0}
      >
        <Users className="h-4 w-4" aria-hidden="true" />
        <span>
          {isWixEvent ? (
            "RSVPs from previous platform"
          ) : (
            `${rsvpCount} / ${maxGuests} attending`
          )}
        </span>
      </div>
    </div>
  );
}