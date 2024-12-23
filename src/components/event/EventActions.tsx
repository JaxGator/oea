import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GuestList } from "./GuestList";
import { useState } from "react";
import { Trash2Icon, Edit2Icon } from "lucide-react";

interface Guest {
  firstName: string;
}

interface EventActionsProps {
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  onRSVP: (guests?: Guest[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  showDelete?: boolean;
  canAddGuests?: boolean;
  currentGuests?: Guest[];
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
  canAddGuests,
  currentGuests = []
}: EventActionsProps) {
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);

  const handleRSVP = () => {
    if (guests.length > 0) {
      onRSVP(guests);
    } else {
      onRSVP();
    }
    setShowGuestDialog(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {!userRSVPStatus && !isPastEvent && (
        <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              disabled={isFullyBooked}
            >
              {isFullyBooked ? "Event Full" : "RSVP"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>RSVP to Event</DialogTitle>
              <DialogDescription>
                Add any guests you'd like to bring (optional)
              </DialogDescription>
            </DialogHeader>
            <GuestList onGuestsChange={setGuests} />
            <Button onClick={handleRSVP} className="bg-[#0d97d1] hover:bg-[#0d97d1]/90">
              Confirm RSVP
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {userRSVPStatus === "attending" && !isPastEvent && (
        <>
          <Button
            variant="destructive"
            onClick={onCancelRSVP}
          >
            Cancel RSVP
          </Button>
          {canAddGuests && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Guests</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Guests</DialogTitle>
                  <DialogDescription>
                    Add additional guests to your RSVP
                  </DialogDescription>
                </DialogHeader>
                <GuestList 
                  onGuestsChange={(newGuests) => onRSVP(newGuests)} 
                  initialGuests={currentGuests}
                />
              </DialogContent>
            </Dialog>
          )}
        </>
      )}

      {isAdmin && !isWixEvent && (
        <Button
          variant="outline"
          onClick={onEdit}
          className="ml-auto"
        >
          <Edit2Icon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )}

      {showDelete && (
        <Button
          variant="destructive"
          onClick={onDelete}
        >
          <Trash2Icon className="w-4 h-4 mr-2" />
          Delete
        </Button>
      )}
    </div>
  );
}