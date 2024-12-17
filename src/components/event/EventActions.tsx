import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { GuestList } from "./GuestList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  showDelete,
}: EventActionsProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        {showDelete && (
          <>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
              className="px-3"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this event? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}