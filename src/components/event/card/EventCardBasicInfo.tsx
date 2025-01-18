import { useAuthState } from "@/hooks/useAuthState";
import { format } from "date-fns";

interface EventCardBasicInfoProps {
  date: string;
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

  const formattedDate = format(new Date(date), 'MMMM d, yyyy');

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {formattedDate}
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