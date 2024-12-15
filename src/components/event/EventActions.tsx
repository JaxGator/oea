import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { GuestList } from "./GuestList";

interface Guest {
  firstName: string;
}

interface EventActionsProps {
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  onRSVP: (guests: Guest[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
}

export function EventActions({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  onRSVP,
  onCancelRSVP,
  onEdit,
}: EventActionsProps) {
  const [guests, setGuests] = useState<Guest[]>([]);

  return (
    <div className="space-y-4">
      {!userRSVPStatus && !isFullyBooked && (
        <GuestList onGuestsChange={setGuests} />
      )}
      <div className="flex gap-2">
        {userRSVPStatus ? (
          <Button
            onClick={onCancelRSVP}
            variant="outline"
            className="flex-1"
          >
            Cancel RSVP
          </Button>
        ) : (
          <Button
            onClick={() => onRSVP(guests)}
            disabled={isFullyBooked}
            className="flex-1 bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            {isFullyBooked ? "Fully Booked" : "RSVP Now"}
          </Button>
        )}
        {isAdmin && (
          <Button
            onClick={onEdit}
            variant="outline"
            className="px-3"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}