
import { useState, useEffect } from "react";
import { RSVPActions } from "./actions/RSVPActions";
import { AdminActions } from "./actions/AdminActions";
import { EventDetailsActions } from "./actions/EventDetailsActions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/usePermissions";

interface EventActionsSectionProps {
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  currentGuests: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  onViewDetails?: () => void;
  showPublishToggle?: boolean;
  isPublished?: boolean;
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
  isAdmin?: boolean;
  canManageEvents?: boolean;
}

export function EventActionsSection({
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
  isWixEvent = false,
  isAdmin,
  canManageEvents
}: EventActionsSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const { getEffectivePermissions } = usePermissions();
  
  // Get synchronous permissions for rendering if not provided from props
  const permissions = getEffectivePermissions();
  const effectiveIsAdmin = isAdmin !== undefined ? isAdmin : permissions.isAdmin;
  const effectiveCanManage = canManageEvents !== undefined ? canManageEvents : permissions.canManageEvents;

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

  // Show message if authentication is required but user isn't authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          Please sign in to interact with this event.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <RSVPActions
        isAuthenticated={isAuthenticated}
        userRSVPStatus={userRSVPStatus}
        canAddGuests={canAddGuests}
        isFullyBooked={isFullyBooked}
        isPastEvent={isPastEvent}
        isSubmitting={isSubmitting}
        currentGuests={currentGuests}
        eventTitle={event.title}
        onRSVP={handleRSVP}
        onCancelRSVP={handleCancelRSVP}
        canJoinWaitlist={canJoinWaitlist}
      />
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap items-center justify-between'} gap-2 mt-4`}>
        <AdminActions
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          showDelete={showDelete}
          showPublishToggle={showPublishToggle}
          isPublished={isPublished}
          createdBy={event.created_by || ''}
          eventId={event.id}
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
