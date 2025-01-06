import { Event } from "@/types/event";
import { EventCardContainer } from "./event/EventCardContainer";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
}

export function EventCard({ 
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus = null,
  onUpdate
}: EventCardProps) {
  if (!event) {
    console.error("Event object is undefined");
    return null;
  }

  return (
    <EventCardContainer 
      event={event}
      onRSVP={onRSVP}
      onCancelRSVP={onCancelRSVP}
      userRSVPStatus={userRSVPStatus}
      onUpdate={onUpdate}
    />
  );
}