import { useAuthState } from "@/hooks/useAuthState";
import { Event } from "@/types/event";
import { EventStatusDisplay } from "./EventStatusDisplay";
import { WaitlistInfo } from "./WaitlistInfo";

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
  isPastEvent?: boolean;
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
  importedRsvpCount,
  isPastEvent = false
}: EventCardBasicInfoProps) {
  const { isAuthenticated } = useAuthState();
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const displayCount = importedRsvpCount !== null ? importedRsvpCount : rsvpCount;
  const isFull = displayCount >= maxGuests;

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        <p>{formattedDate}</p>
        {isAuthenticated && <p>{location}</p>}
      </div>
      <div className="text-sm">
        <EventStatusDisplay
          displayCount={displayCount}
          maxGuests={maxGuests}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          isFull={isFull}
        />
        <WaitlistInfo
          waitlistEnabled={waitlistEnabled}
          waitlistCount={waitlistCount}
          waitlistCapacity={waitlistCapacity}
        />
      </div>
    </div>
  );
}