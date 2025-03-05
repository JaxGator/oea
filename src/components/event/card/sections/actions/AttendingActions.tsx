
import { Button } from "@/components/ui/button";
import { CheckCircle, UserPlus, X } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";

interface AttendingActionsProps {
  canAddGuests: boolean;
  isAddingGuests: boolean;
  isSubmitting: boolean;
  onAddGuests: () => void;
  onCancelRSVP: () => void;
}

export function AttendingActions({
  canAddGuests,
  isAddingGuests,
  isSubmitting,
  onAddGuests,
  onCancelRSVP
}: AttendingActionsProps) {
  return (
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
          onClick={onAddGuests}
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
  );
}
