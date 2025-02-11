
import { EventActionButtons } from "./EventActionButtons";
import { AdminActions } from "./AdminActions";
import { EventShareMenu } from "../share/EventShareMenu";

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
  isAuthChecking?: boolean;
  requireAuth?: boolean;
  event: { id: string; title: string };
  isAuthenticated?: boolean;
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
  showPublishToggle = false,
  isAuthChecking = false,
  requireAuth = false,
  event,
  isAuthenticated = false
}: EventActionsProps) {
  const showViewDetails = isAdmin || canManageEvents || userRSVPStatus === "attending";

  console.log('EventActions - Authentication state:', { isAuthenticated });

  if (isAuthChecking) {
    return (
      <div className="flex flex-wrap gap-1">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      <EventActionButtons
        userRSVPStatus={userRSVPStatus}
        isPastEvent={isPastEvent || false}
        isFullyBooked={isFullyBooked}
        canJoinWaitlist={canJoinWaitlist}
        canAddGuests={canAddGuests}
        currentGuests={currentGuests}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onViewDetails={onViewDetails}
        showViewDetails={showViewDetails}
        requireAuth={requireAuth}
      />

      {!isAuthenticated && (
        <EventShareMenu eventId={event.id} title={event.title} />
      )}

      {(isAdmin || canManageEvents) && (
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
