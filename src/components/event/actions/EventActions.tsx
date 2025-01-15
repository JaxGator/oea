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
  onViewDetails?: () => void;
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
  onViewDetails,
}: EventActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-start">
      {/* RSVP Actions */}
      {!isPastEvent && (
        <div className="flex gap-3 items-center">
          {!userRSVPStatus && isPublished && (
            <RSVPButton 
              isFullyBooked={isFullyBooked} 
              onRSVP={onRSVP} 
              canJoinWaitlist={canJoinWaitlist}
            />
          )}

          {userRSVPStatus === "attending" && (
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
      )}

      {/* View Details Button */}
      {onViewDetails && (
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      )}

      {/* Admin Actions */}
      {(isAdmin || canManageEvents) && (
        <div className="flex gap-3 items-center ml-auto">
          {isPastEvent ? (
            <>
              <Button
                variant="outline"
                onClick={onEdit}
                className="whitespace-nowrap"
              >
                Edit RSVPs
              </Button>
              {!isWixEvent && (
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  className="whitespace-nowrap"
                >
                  Delete
                </Button>
              )}
            </>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}