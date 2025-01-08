import { CardContent, CardFooter } from "@/components/ui/card";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventActions } from "../actions/EventActions";
import { Star } from "lucide-react";

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
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
  isFeatured?: boolean;
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
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity,
  isFeatured = false,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
}: EventCardContentProps) {
  const isFullyBooked = rsvpCount >= maxGuests;
  const canJoinWaitlist = waitlistEnabled && isFullyBooked && 
    (!waitlistCapacity || waitlistCount < waitlistCapacity);

  return (
    <>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <EventCardBasicInfo
            date={date}
            location={location}
            rsvpCount={rsvpCount}
            maxGuests={maxGuests}
            isWixEvent={isWixEvent}
            waitlistEnabled={waitlistEnabled}
            waitlistCount={waitlistCount}
            waitlistCapacity={waitlistCapacity}
          />
          {isFeatured && (
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <EventActions
          isAdmin={isAdmin}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={isFullyBooked}
          canJoinWaitlist={canJoinWaitlist}
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