
import { useAuthState } from "@/hooks/useAuthState";
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
  isPastEvent,
  canViewDetails = false
}: EventCardBasicInfoProps) {
  const { profile, isAuthenticated } = useAuthState();
  const showDetails = canViewDetails || (isAuthenticated && profile?.is_approved);

  // Parse the date and time as UTC first
  const isoString = `${date}T${time}Z`; // Append Z to treat as UTC
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  // Format the date and time in user's timezone
  const formattedDate = formatInTimeZone(
    parseISO(isoString),
    userTimeZone,
    'MMMM d, yyyy'
  );

  const formattedTime = formatInTimeZone(
    parseISO(isoString),
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
          {showDetails ? (
            location
          ) : (
            "Location visible after approval"
          )}
        </p>
        {showDetails && (
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
        )}
        {isPastEvent && (
          <p className="text-sm text-muted-foreground italic">
            This event has already taken place
          </p>
        )}
      </div>
    </div>
  );
}
