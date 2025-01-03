import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuthState } from "@/hooks/useAuthState";

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
  const { user, profile } = useAuthState();
  const showLocation = user && profile?.is_approved;
  const isWixEvent = description === 'Imported from Wix';

  // Parse the date string and create a new Date object in local timezone
  const eventDate = parseISO(date);

  // Convert time from 24-hour to 12-hour format
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600">
        <CalendarIcon className="w-4 h-4" />
        <span className="text-sm">
          {format(eventDate, "EEEE, MMMM do, yyyy")} at {formatTime(time)}
        </span>
      </div>
      
      {showLocation ? (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm italic">Location visible after approval</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-gray-600">
        <UsersIcon className="w-4 h-4" />
        <span className="text-sm">
          {isWixEvent ? (
            `${rsvpCount} attendees`
          ) : (
            `${rsvpCount} / ${maxGuests} attendees`
          )}
        </span>
      </div>

      {attendeeNames.length > 0 && (
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Attending:</p>
          <p>{attendeeNames.join(', ')}</p>
        </div>
      )}
      
      {userRSVPStatus && (
        <Badge variant="secondary" className="mt-2">
          Your RSVP: {userRSVPStatus}
        </Badge>
      )}
    </div>
  );
}