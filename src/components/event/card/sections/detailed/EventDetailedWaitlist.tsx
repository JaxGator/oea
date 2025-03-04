
import { WaitlistInfo } from "../../WaitlistInfo";

interface EventDetailedWaitlistProps {
  waitlistEnabled?: boolean;
  waitlistCount: number;
  waitlistCapacity?: number | null;
}

export function EventDetailedWaitlist({
  waitlistEnabled,
  waitlistCount,
  waitlistCapacity
}: EventDetailedWaitlistProps) {
  if (!waitlistEnabled) return null;
  
  return (
    <WaitlistInfo
      waitlistEnabled={!!waitlistEnabled}
      waitlistCount={waitlistCount}
      waitlistCapacity={waitlistCapacity}
    />
  );
}
