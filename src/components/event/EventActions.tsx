import { Button } from "@/components/ui/button";
import { GuestList } from "./GuestList";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EventActionsProps {
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  showDelete?: boolean;
  canAddGuests?: boolean;
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
  canAddGuests
}: EventActionsProps) {
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  const handleRSVP = (guests?: { firstName: string }[]) => {
    onRSVP(guests);
    setShowGuestDialog(false);
  };

  if (isPastEvent) {
    return (
      <div className="w-full flex justify-end space-x-2">
        {showDelete && (
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-2">
      <div className="flex-1">
        {userRSVPStatus === "attending" ? (
          <Button
            variant="destructive"
            onClick={onCancelRSVP}
            className="w-full sm:w-auto"
          >
            Cancel RSVP
          </Button>
        ) : !isFullyBooked && (
          <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">RSVP</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>RSVP with Guests</DialogTitle>
              </DialogHeader>
              <GuestList onGuestsChange={handleRSVP} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {canAddGuests && !isPastEvent && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Add Guests
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guests</DialogTitle>
            </DialogHeader>
            <GuestList onGuestsChange={handleRSVP} />
          </DialogContent>
        </Dialog>
      )}

      {isAdmin && (
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          {showDelete && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}