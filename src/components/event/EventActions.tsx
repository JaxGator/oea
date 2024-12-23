import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GuestList } from "./GuestList";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventAdminActions } from "./EventAdminActions";

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
  onDelete: () => void;
  isPastEvent: boolean;
  isWixEvent: boolean;
  showDelete: boolean;
}

export function EventActions({
  isAdmin,
  userRSVPStatus,
  isFullyBooked,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  isPastEvent,
  isWixEvent,
  showDelete,
}: EventActionsProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRSVP = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to RSVP",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    onRSVP(guests);
  };

  const disableRSVP = isPastEvent || (isPastEvent && isWixEvent);

  return (
    <div className="space-y-4">
      {!userRSVPStatus && !isFullyBooked && !disableRSVP && (
        <GuestList onGuestsChange={setGuests} />
      )}
      <div className="flex gap-2">
        {userRSVPStatus && !disableRSVP ? (
          <Button
            onClick={onCancelRSVP}
            variant="outline"
            className="flex-1"
          >
            Cancel RSVP
          </Button>
        ) : !disableRSVP ? (
          <Button
            onClick={handleRSVP}
            disabled={isFullyBooked}
            className="flex-1 bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            {isFullyBooked ? "Fully Booked" : "RSVP Now"}
          </Button>
        ) : null}
        
        <EventAdminActions
          isAdmin={isAdmin}
          showDelete={showDelete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}