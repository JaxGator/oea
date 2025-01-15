import { Event } from "@/types/event";
import { useAuthState } from "@/hooks/useAuthState";

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
  isPastEvent
}: EventCardBasicInfoProps) {
  const { profile, isAuthenticated } = useAuthState();
  const canViewDetails = isAuthenticated && profile?.is_approved;

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {date}
        </p>
        <p className="text-sm text-muted-foreground">
          {canViewDetails ? (
            location
          ) : (
            "Location visible after approval"
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          {canViewDetails ? (
            isWixEvent ? (
              `${importedRsvpCount || 0} attendees`
            ) : (
              `${rsvpCount} / ${maxGuests} attendees`
            )
          ) : (
            "Attendee information visible after approval"
          )}
          {canViewDetails && waitlistEnabled && (
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