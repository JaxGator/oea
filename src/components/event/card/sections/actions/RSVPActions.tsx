
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, UserPlus, X, Calendar, Users } from "lucide-react";
import { GuestInput } from "@/components/event/guest/GuestInput";
import { GuestListDisplay } from "@/components/event/guest/GuestListDisplay";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";

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
  const [showGuestInput, setShowGuestInput] = useState(false);
  const [guests, setGuests] = useState<{ firstName: string }[]>(currentGuests);
  const [isAddingGuests, setIsAddingGuests] = useState(false);

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
    setShowGuestInput(false);
    setIsAddingGuests(false);
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
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-green-50 text-green-600 border-green-200"
            disabled
          >
            <CheckCircle className="h-4 w-4" />
            Attending
          </Button>
          
          {!isAddingGuests && canAddGuests && (
            <Button 
              variant="outline" 
              onClick={() => setIsAddingGuests(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Guests
            </Button>
          )}
          
          <LoadingButton 
            variant="outline" 
            onClick={onCancelRSVP}
            isLoading={isSubmitting}
            className="flex items-center gap-2 text-red-500 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            Cancel RSVP
          </LoadingButton>
        </div>
        
        {isAddingGuests && (
          <div className="space-y-3 p-3 border rounded-md bg-gray-50">
            <h4 className="text-sm font-medium">Add Guests</h4>
            
            {guests.length > 0 && (
              <GuestListDisplay 
                guests={guests} 
                onRemoveGuest={handleRemoveGuest} 
              />
            )}
            
            <GuestInput onAddGuest={handleAddGuest} />
            
            <div className="flex gap-2 justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAddingGuests(false);
                  setGuests(currentGuests);
                }}
              >
                Cancel
              </Button>
              
              <LoadingButton 
                size="sm" 
                onClick={handleRSVP}
                isLoading={isSubmitting}
              >
                {guests.length > currentGuests.length
                  ? `Save ${guests.length - currentGuests.length} New Guests`
                  : "Update Guests"}
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle waitlist state
  if (isWaitlisted) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-yellow-50 text-yellow-600 border-yellow-200"
          disabled
        >
          <Users className="h-4 w-4" />
          On Waitlist
        </Button>
        
        <LoadingButton 
          variant="outline" 
          onClick={onCancelRSVP}
          isLoading={isSubmitting}
          className="flex items-center gap-2 text-red-500 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
          Leave Waitlist
        </LoadingButton>
      </div>
    );
  }

  // Normal RSVP button for non-attending users
  return (
    <div className="flex gap-2">
      {isFullyBooked && !canJoinWaitlist ? (
        <Button disabled className="flex items-center gap-2 opacity-70">
          <Calendar className="h-4 w-4" />
          Event Full
        </Button>
      ) : (
        <LoadingButton
          onClick={handleRSVP}
          isLoading={isSubmitting}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          {isFullyBooked && canJoinWaitlist ? "Join Waitlist" : "RSVP"}
        </LoadingButton>
      )}
    </div>
  );
}
