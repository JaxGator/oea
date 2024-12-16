import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { GuestList } from "./GuestList";
import { useAuthState } from "@/hooks/useAuthState";
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
  const { user } = useAuthState();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking approval status:', error);
        return;
      }
      
      setIsApproved(!!data?.is_approved);
    };

    checkApprovalStatus();
  }, [user]);

  const handleRSVP = () => {
    if (!isApproved) {
      toast.error("You need to be approved by an admin before you can RSVP to events.");
      return;
    }
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
            disabled={isFullyBooked || !isApproved}
            className="flex-1 bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            {isFullyBooked ? "Fully Booked" : !isApproved ? "Approval Required" : "RSVP Now"}
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