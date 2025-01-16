import { Button } from "@/components/ui/button";
import { RSVPButton } from "./RSVPButton";
import { AddGuestsButton } from "./AddGuestsButton";
import { AdminActions } from "./AdminActions";
import { Eye } from "lucide-react";

interface Guest {
  firstName: string;
}

interface EventActionsProps {
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isFullyBooked: boolean;
  canJoinWaitlist?: boolean;
  onRSVP: (guests?: Guest[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isPastEvent?: boolean;
  isWixEvent?: boolean;
  showDelete?: boolean;
  canAddGuests?: boolean;
  currentGuests?: Guest[];
  onViewDetails?: () => void;
  isPublished?: boolean;
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
  showDelete,
  canAddGuests,
  currentGuests = [],
  onViewDetails,
  isPublished,
  showPublishToggle = false
}: EventActionsProps) {
  const showViewDetails = isAdmin || canManageEvents || userRSVPStatus === "attending";

  return (
    <div className="flex flex-wrap gap-1">
      {!userRSVPStatus && !isPastEvent && (
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

      {showViewDetails && onViewDetails && (
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          Details
        </Button>
      )}

      {isAdmin && (
        <AdminActions
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          showDelete={showDelete}
          isWixEvent={isWixEvent}
          canManageEvents={canManageEvents}
          isPublished={isPublished}
          showPublishToggle={showPublishToggle}
        />
      )}
    </div>
  );
}