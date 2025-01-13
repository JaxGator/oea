import { Event } from "@/types/event";

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
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {date}
        </p>
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