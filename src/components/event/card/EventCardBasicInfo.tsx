
import { formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";

interface EventCardBasicInfoProps {
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
  waitlistEnabled?: boolean;
  waitlistCapacity?: number | null;
  importedRsvpCount?: number | null;
  isPastEvent: boolean;
  canViewDetails?: boolean;
}

export function EventCardBasicInfo({ 
  date,
  time,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
  waitlistEnabled,
  waitlistCapacity,
  importedRsvpCount,
  isPastEvent
}: EventCardBasicInfoProps) {
  // Create a local ISO string without the UTC 'Z' suffix
  const localIsoString = `${date}T${time}`;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  // Parse and format the date and time in user's timezone
  const formattedDate = formatInTimeZone(
    parseISO(localIsoString),
    userTimeZone,
    'MMMM d, yyyy'
  );

  const formattedTime = formatInTimeZone(
    parseISO(localIsoString),
    userTimeZone,
    'h:mm a'
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formattedDate} at {formattedTime}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {location}
        </p>
        <p className="text-sm text-muted-foreground">
          {isWixEvent ? (
            `${importedRsvpCount || 0} attendees`
          ) : (
            `${rsvpCount} / ${maxGuests} attendees`
          )}
          {waitlistEnabled && (
            ` (Waitlist: ${waitlistCapacity || 'unlimited'})`
          )}
        </p>
        {isPastEvent && (
          <p className="text-sm text-muted-foreground italic">
            This event has already taken place
          </p>
        )}
      </div>
    </div>
  );
}
