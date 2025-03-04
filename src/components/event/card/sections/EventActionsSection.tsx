
import { useState } from "react";
import { RSVPActions } from "./actions/RSVPActions";
import { AdminActions } from "./actions/AdminActions";
import { EventDetailsActions } from "./actions/EventDetailsActions";
import { useEventActions } from "@/hooks/events/useEventActions";

interface EventActionsSectionProps {
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
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails?: () => void;
  onTogglePublish?: () => void;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
  event: {
    id: string;
    title: string;
    created_by?: string;
  };
  showDelete?: boolean;
  isAuthenticated?: boolean;
  isFullyBooked?: boolean;
  canJoinWaitlist?: boolean;
  isWixEvent?: boolean;
}

export function EventActionsSection({
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  onViewDetails,
  showPublishToggle = false,
  isPublished = true,
  isAuthChecking = false,
  requireAuth = false,
  event,
  showDelete = false,
  isAuthenticated = false,
  isFullyBooked = false,
  canJoinWaitlist = false,
  isWixEvent = false
}: EventActionsSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use our enhanced event actions hook for this event
  const { isLoading: isActionLoading } = useEventActions({
    eventId: event.id,
    createdBy: event.created_by || ''
  });

  const handleRSVP = async (guests?: { firstName: string }[]) => {
    setIsSubmitting(true);
    try {
      await onRSVP(guests);
    } catch (error) {
      console.error("RSVP error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRSVP = async () => {
    setIsSubmitting(true);
    try {
      await onCancelRSVP();
    } catch (error) {
      console.error("Cancel RSVP error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything while checking auth
  if (isAuthChecking) {
    return null;
  }

  return (
    <div className="space-y-4">
      <RSVPActions
        isAuthenticated={isAuthenticated}
        userRSVPStatus={userRSVPStatus}
        canAddGuests={canAddGuests}
        isFullyBooked={isFullyBooked}
        isPastEvent={isPastEvent}
        isSubmitting={isSubmitting || isActionLoading}
        currentGuests={currentGuests}
        eventTitle={event.title}
        onRSVP={handleRSVP}
        onCancelRSVP={handleCancelRSVP}
      />
      
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <AdminActions
          isAdmin={isAdmin}
          canManageEvents={canManageEvents}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          showDelete={showDelete}
          showPublishToggle={showPublishToggle}
          isPublished={isPublished}
          createdBy={event.created_by || ''}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
        />
        
        <EventDetailsActions
          eventId={event.id}
          eventTitle={event.title}
          onViewDetails={onViewDetails}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
          onRSVP={handleRSVP}
        />
      </div>
    </div>
  );
}
