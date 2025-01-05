import { Event } from "@/types/event";
import { EventCardContainer } from "./event/EventCardContainer";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
}

export function EventCard(props: EventCardProps) {
  return <EventCardContainer {...props} />;
}