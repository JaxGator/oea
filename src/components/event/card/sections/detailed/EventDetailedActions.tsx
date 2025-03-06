
import { EventActionsSection } from "../EventActionsSection";

interface EventDetailedActionsProps {
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  currentGuests: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isFullyBooked: boolean;
  canJoinWaitlist: boolean;
  isWixEvent: boolean;
  event: {
    id: string;
    title: string;
    created_by?: string;
    is_published?: boolean;
  };
  isAuthenticated?: boolean;
}

export function EventDetailedActions({
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  currentGuests,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isFullyBooked,
  canJoinWaitlist,
  isWixEvent,
  event,
  isAuthenticated = true,
}: EventDetailedActionsProps) {
  return (
    <EventActionsSection
      isAdmin={true}
      canManageEvents={true}
      userRSVPStatus={userRSVPStatus}
      isFullyBooked={isFullyBooked}
      canJoinWaitlist={canJoinWaitlist}
      onRSVP={onRSVP}
      onCancelRSVP={onCancelRSVP}
      onEdit={onEdit}
      onDelete={onDelete}
      onTogglePublish={onTogglePublish}
      isPastEvent={isPastEvent}
      isWixEvent={isWixEvent}
      isPublished={event.is_published}
      showPublishToggle={true}
      canAddGuests={canAddGuests}
      currentGuests={currentGuests}
      event={{ 
        id: event.id, 
        title: event.title,
        created_by: event.created_by
      }}
      isAuthenticated={true}
      showDelete={true}
    />
  );
}
