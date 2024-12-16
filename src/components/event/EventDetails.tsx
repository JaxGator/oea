import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface EventDetailsProps {
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  description: string;
  attendeeNames: string[];
  userRSVPStatus?: string | null;
}

export function EventDetails({
  date,
  time,
  location,
  rsvpCount,
  maxGuests,
  description,
  attendeeNames,
  userRSVPStatus,
}: EventDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm">
          {format(new Date(date), "EEEE, MMMM do, yyyy")} at {time}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <MapPinIcon className="w-4 h-4" />
        <span className="text-sm">{location}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <UsersIcon className="w-4 h-4" />
        <span className="text-sm">
          {rsvpCount} / {maxGuests} attendees
        </span>
      </div>
      {attendeeNames.length > 0 && (
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Attending:</p>
          <p>{attendeeNames.join(', ')}</p>
        </div>
      )}
      <div 
        className="text-gray-600 prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {userRSVPStatus && (
        <Badge variant="secondary" className="mt-2">
          Your RSVP: {userRSVPStatus}
        </Badge>
      )}
    </div>
  );
}