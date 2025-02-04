
import { Event } from "@/types/event";
import { EventCardContainer } from "./event/EventCardContainer";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onSelect?: () => void;
  isSelected?: boolean;
  onUpdate?: () => void;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
}

export function EventCard({ 
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus = null,
  onSelect,
  isSelected = false,
  onUpdate,
  isAuthChecking = false,
  requireAuth = false
}: EventCardProps) {
  if (!event) {
    console.error("Event object is undefined");
    return null;
  }

  return (
    <div className="h-full">
      <EventCardContainer 
        event={{
          ...event,
          time: event.time || '00:00:00' // Ensure time is always provided
        }}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        userRSVPStatus={userRSVPStatus}
        onSelect={onSelect}
        isSelected={isSelected}
        onUpdate={onUpdate}
        isAuthChecking={isAuthChecking}
        requireAuth={requireAuth}
        showDelete={true}
      />
    </div>
  );
}
