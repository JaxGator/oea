
interface EventCardBasicInfoProps {
  date: string;
  time: string;
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
  time,
  rsvpCount,
  maxGuests,
  isWixEvent,
  waitlistEnabled,
  waitlistCapacity,
  importedRsvpCount,
  isPastEvent,
}: EventCardBasicInfoProps) {
  // Create a proper date-time string and handle timezone
  const dateTimeStr = `${date}T${time}`;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  
  // Format the date in the user's timezone
  const formattedDate = formatInTimeZone(
    new Date(dateTimeStr),
    userTimeZone,
    'MMMM d, yyyy'
  );

  const formattedTime = formatInTimeZone(
    new Date(dateTimeStr),
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
