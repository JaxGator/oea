interface EventCardBasicInfoProps {
  date: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
}

export function EventCardBasicInfo({
  date,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity
}: EventCardBasicInfoProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        <p>{formattedDate}</p>
        <p>{location}</p>
      </div>
      <div className="text-sm">
        <p>
          {rsvpCount} / {maxGuests} spots filled
          {isWixEvent && " (imported from Wix)"}
        </p>
        {waitlistEnabled && (
          <p className="text-gray-600">
            Waitlist: {waitlistCount} {waitlistCapacity ? `/ ${waitlistCapacity}` : ''} people
          </p>
        )}
      </div>
    </div>
  );
}