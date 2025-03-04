
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Edit, Trash2, ToggleLeft, ToggleRight, UserPlus, Loader2 } from "lucide-react";
import { canEditEvent, canDeleteEvent } from "@/utils/permissionsUtils";
import { useAuthState } from "@/hooks/useAuthState";
import { EventShareMenu } from "@/components/event/share/EventShareMenu";
import { EventGuestDialog } from "../../guests/EventGuestDialog";

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
  const { toast } = useToast();
  const { user } = useAuthState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);

  const handleRSVP = async (guests?: { firstName: string }[]) => {
    setIsSubmitting(true);
    try {
      await onRSVP(guests);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your RSVP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRSVP = async () => {
    setIsSubmitting(true);
    try {
      await onCancelRSVP();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Failed to cancel RSVP. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {isAuthenticated ? (
        <>
          {userRSVPStatus === 'attending' ? (
            <Button 
              variant="destructive" 
              onClick={handleCancelRSVP}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  Cancelling...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : 'Cancel RSVP'}
            </Button>
          ) : (
            <>
              {canAddGuests && (
                <Button 
                  onClick={() => setShowGuestDialog(true)}
                  disabled={isSubmitting || isFullyBooked}
                >
                  RSVP with Guests
                </Button>
              )}
              {!canAddGuests && (
                <Button 
                  onClick={() => handleRSVP()} 
                  disabled={isFullyBooked || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Reserving Spot...
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    isFullyBooked ? 'Event Full' : 'RSVP'
                  )}
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <Button onClick={() => window.location.href = '/auth'}>
          Sign In to RSVP
        </Button>
      )}
      
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
        <div className="flex flex-wrap items-center gap-2">
          {(isAdmin || (user && canEditEvent(user.id, isAdmin, canManageEvents, user.id))) && !isWixEvent && (
            <Button variant="outline" size="sm" onClick={onEdit} disabled={isPastEvent}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {(isAdmin || (user && canDeleteEvent(user.id, isAdmin, canManageEvents, user.id))) && !isWixEvent && showDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete} disabled={isPastEvent}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          {showPublishToggle && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onTogglePublish}
            >
              {isPublished ? (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Unpublish
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              View Details
            </Button>
          )}
          
          <EventShareMenu 
            eventId={event.id} 
            title={event.title} 
          />
          
          {canAddGuests && (
            <Button variant="outline" size="sm" onClick={() => setShowGuestDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Guests
            </Button>
          )}
        </div>
      </div>

      <EventGuestDialog
        open={showGuestDialog}
        onOpenChange={setShowGuestDialog}
        onSave={handleRSVP}
        currentGuests={currentGuests}
        eventTitle={event.title}
      />
    </div>
  );
}
