import { Button } from "@/components/ui/button";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";
import { AdminActions } from "./AdminActions";

interface Guest {
  firstName: string;
}

interface EventActionsProps {
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  canJoinWaitlist: boolean;
  onRSVP: (guests?: Guest[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isPastEvent: boolean;
  isWixEvent: boolean;
  isPublished: boolean;
  canAddGuests: boolean;
  currentGuests?: Guest[];
  showPublishToggle?: boolean;
}

export function EventActions({
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isFullyBooked,
  canJoinWaitlist,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isPastEvent,
  isWixEvent,
  isPublished,
  canAddGuests,
  currentGuests = [],
  showPublishToggle = true,
}: EventActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-start">
      <div className="flex gap-2 items-center">
        {!userRSVPStatus && !isPastEvent && isPublished && (
          <RSVPButton 
            isFullyBooked={isFullyBooked} 
            onRSVP={onRSVP} 
            canJoinWaitlist={canJoinWaitlist}
          />
        )}

        {userRSVPStatus === "attending" && !isPastEvent && (
          <>
            <Button
              variant="destructive"
              onClick={onCancelRSVP}
              className="whitespace-nowrap"
            >
              Cancel RSVP
            </Button>
            {canAddGuests && (
              <AddGuestsButton 
                onAddGuests={(newGuests) => onRSVP(newGuests)}
                currentGuests={currentGuests}
              />
            )}
          </>
        )}
      </div>

      {(isAdmin || canManageEvents) && (
        <div className="flex gap-2 items-center ml-auto">
          <AdminActions
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePublish={onTogglePublish}
            showDelete={true}
            isWixEvent={isWixEvent}
            isPublished={isPublished}
            showPublishToggle={showPublishToggle}
            canManageEvents={canManageEvents}
          />
        </div>
      )}

      {(isAdmin || canManageEvents) && isPastEvent && (
        <Button
          variant="outline"
          onClick={onEdit}
          className="whitespace-nowrap"
        >
          Edit RSVPs
        </Button>
      )}
    </div>
  );
}