
import { Event } from "@/types/event";
import { EventRSVPContainer } from "./containers/EventRSVPContainer";

interface EventCardContainerProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
  showDelete?: boolean;
  isAuthenticated?: boolean;
}

export function EventCardContainer({
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus,
  onUpdate,
  onSelect,
  isSelected = false,
  isAuthChecking = false,
  showDelete = false,
  isAuthenticated = true
}: EventCardContainerProps) {
  if (!event) {
    console.error("Event object is undefined");
    return null;
  }

  return (
    <EventRSVPContainer
      event={event}
      onRSVP={onRSVP}
      onCancelRSVP={onCancelRSVP}
      userRSVPStatus={userRSVPStatus}
      onUpdate={onUpdate}
      onSelect={onSelect}
      isSelected={isSelected}
      isAuthChecking={isAuthChecking}
      showDelete={showDelete}
      isAuthenticated={true}
    />
  );
}
