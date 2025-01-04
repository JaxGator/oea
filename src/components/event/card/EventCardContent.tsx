import { CardContent, CardFooter } from "@/components/ui/card";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventActions } from "../actions/EventActions";

interface EventCardContentProps {
  date: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventCardContent({
  date,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
  isAdmin,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
}: EventCardContentProps) {
  return (
    <>
      <CardContent className="p-4">
        <EventCardBasicInfo
          date={date}
          location={location}
          rsvpCount={rsvpCount}
          maxGuests={maxGuests}
          isWixEvent={isWixEvent}
        />
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <EventActions
          isAdmin={isAdmin}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={rsvpCount >= maxGuests}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          showDelete={isAdmin && (isPastEvent || isWixEvent)}
          canAddGuests={canAddGuests}
        />
      </CardFooter>
    </>
  );
}