
import { ReactNode } from "react";

interface EventRSVPHandlerProps {
  eventId: string;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  children: (handleRSVP: (guests?: { firstName: string }[]) => void) => ReactNode;
}

export function EventRSVPHandler({ eventId, onRSVP, children }: EventRSVPHandlerProps) {
  const handleRSVP = (guests?: { firstName: string }[]) => {
    onRSVP(eventId, guests);
  };

  return <>{children(handleRSVP)}</>;
}
