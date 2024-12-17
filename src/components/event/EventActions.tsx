import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { GuestList } from "./GuestList";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

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
  isPastEvent: boolean;
}

export function EventActions({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  onRSVP,
  onCancelRSVP,
  onEdit,
  isPastEvent,
}: EventActionsProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isApproved, setIsApproved] = useState(false);

  const handleRSVP = () => {
    onRSVP(guests);
  };

  return (
    <div className="space-y-4">
      {!userRSVPStatus && !isFullyBooked && !isPastEvent && (
        <GuestList onGuestsChange={setGuests} />
      )}
      <div className="flex gap-2">
        {userRSVPStatus && !isPastEvent ? (
          <Button
            onClick={onCancelRSVP}
            variant="outline"
            className="flex-1"
          >
            Cancel RSVP
          </Button>
        ) : !isPastEvent ? (
          <Button
            onClick={handleRSVP}
            disabled={isFullyBooked}
            className="flex-1 bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            {isFullyBooked ? "Fully Booked" : "RSVP Now"}
          </Button>
        ) : null}
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