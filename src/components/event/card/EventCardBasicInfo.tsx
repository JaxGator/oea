import { useAuthState } from "@/hooks/useAuthState";

interface EventCardBasicInfoProps {
  date: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
  importedRsvpCount?: number | null;
}

export function EventCardBasicInfo({
  date,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity,
  importedRsvpCount
}: EventCardBasicInfoProps) {
  const { isAuthenticated } = useAuthState();
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Use imported count for past events if available
  const displayCount = importedRsvpCount !== null ? importedRsvpCount : rsvpCount;
  const spotsRemaining = Math.max(0, maxGuests - displayCount);
  const isFull = displayCount >= maxGuests;

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        <p>{formattedDate}</p>
        {isAuthenticated && <p>{location}</p>}
      </div>
      <div className="text-sm">
        <p>
          {displayCount} / {maxGuests} spots filled
          {spotsRemaining > 0 && !isFull && ` (${spotsRemaining} spots remaining)`}
          {isFull && " (Event Full)"}
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