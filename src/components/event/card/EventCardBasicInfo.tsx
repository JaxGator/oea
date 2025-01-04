import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
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
  isWixEvent 
}: EventCardBasicInfoProps) {
  const eventDate = parseISO(date);
  const formattedDate = format(eventDate, "EEEE, MMMM do");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarIcon className="w-4 h-4" role="presentation" />
        <span className="text-sm">{formattedDate}</span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <MapPinIcon className="w-4 h-4" role="presentation" />
        <span className="text-sm">{location}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <UsersIcon className="w-4 h-4" role="presentation" />
        <span className="text-sm">
          {isWixEvent ? (
            `${rsvpCount} attendees`
          ) : (
            `${rsvpCount} / ${maxGuests} attendees`
          )}
        </span>
      </div>
    </div>
  );
}