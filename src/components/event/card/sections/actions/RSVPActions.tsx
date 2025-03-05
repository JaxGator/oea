
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AttendingActions } from "./AttendingActions";
import { GuestManagement } from "./GuestManagement";
import { WaitlistActions } from "./WaitlistActions";
import { RSVPButton } from "./RSVPButton";

interface RSVPActionsProps {
  isAuthenticated: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  isSubmitting?: boolean;
  isFullyBooked?: boolean;
  canJoinWaitlist?: boolean;
  canAddGuests: boolean;
  currentGuests: { firstName: string }[];
  eventTitle: string;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
}

export function RSVPActions({
  isAuthenticated,
  userRSVPStatus,
  isPastEvent,
  isSubmitting = false,
  isFullyBooked = false,
  canJoinWaitlist = false,
  canAddGuests,
  currentGuests = [],
  eventTitle,
  onRSVP,
  onCancelRSVP
}: RSVPActionsProps) {
  const [isAddingGuests, setIsAddingGuests] = useState(false);
  const [guests, setGuests] = useState<{ firstName: string }[]>(currentGuests);

  // Determine RSVP state
  const isAttending = userRSVPStatus === 'attending';
  const isWaitlisted = userRSVPStatus === 'waitlist';
  
  // Handle adding a guest
  const handleAddGuest = (firstName: string) => {
    if (firstName.trim()) {
      const updatedGuests = [...guests, { firstName: firstName.trim() }];
      setGuests(updatedGuests);
      
      // Show success message for better feedback
      toast.success(`Added ${firstName} to your guest list`);
    }
  };

  // Handle removing a guest
  const handleRemoveGuest = (index: number) => {
    const updatedGuests = [...guests];
    const removedGuest = updatedGuests[index];
    updatedGuests.splice(index, 1);
    setGuests(updatedGuests);
    
    // Show feedback on guest removal
    if (removedGuest && removedGuest.firstName) {
      toast.info(`Removed ${removedGuest.firstName} from your guest list`);
    }
  };

  // Handle RSVP with the current guest list
  const handleRSVP = () => {
    onRSVP(guests.length > 0 ? guests : undefined);
    setIsAddingGuests(false);
  };

  // Handle starting the add guests flow
  const handleStartAddGuests = () => {
    setIsAddingGuests(true);
  };

  // Handle canceling the add guests flow
  const handleCancelAddGuests = () => {
    setIsAddingGuests(false);
    setGuests(currentGuests);
  };

  // Don't render anything for past events to avoid confusion
  if (isPastEvent) {
    return null;
  }

  // If not authenticated, simply show a message
  if (!isAuthenticated) {
    return (
      <Button variant="outline" disabled className="w-full md:w-auto opacity-70">
        Sign in to RSVP
      </Button>
    );
  }

  // If user is already attending, show cancel and guest options
  if (isAttending) {
    return (
      <div className="space-y-4">
        <AttendingActions
          canAddGuests={canAddGuests}
          isAddingGuests={isAddingGuests}
          isSubmitting={isSubmitting}
          onAddGuests={handleStartAddGuests}
          onCancelRSVP={onCancelRSVP}
        />
        
        {isAddingGuests && (
          <GuestManagement
            guests={guests}
            currentGuests={currentGuests}
            onAddGuest={handleAddGuest}
            onRemoveGuest={handleRemoveGuest}
            onCancel={handleCancelAddGuests}
            onSave={handleRSVP}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    );
  }

  // Handle waitlist state
  if (isWaitlisted) {
    return (
      <WaitlistActions
        isSubmitting={isSubmitting}
        onCancelRSVP={onCancelRSVP}
      />
    );
  }

  // Normal RSVP button for non-attending users
  return (
    <div className="flex gap-2">
      <RSVPButton
        isFullyBooked={isFullyBooked}
        canJoinWaitlist={canJoinWaitlist}
        isSubmitting={isSubmitting}
        onRSVP={handleRSVP}
      />
    </div>
  );
}
