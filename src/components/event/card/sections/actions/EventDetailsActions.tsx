
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { EventShareMenu } from "@/components/event/share/EventShareMenu";
import { EventGuestDialog } from "@/components/event/guests/EventGuestDialog";
import { useState } from "react";

interface EventDetailsActionsProps {
  eventId: string;
  eventTitle: string;
  onViewDetails?: () => void;
  canAddGuests: boolean;
  currentGuests: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
}

export function EventDetailsActions({
  eventId,
  eventTitle,
  onViewDetails,
  canAddGuests,
  currentGuests,
  onRSVP
}: EventDetailsActionsProps) {
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  
  return (
    <div className="flex items-center gap-2">
      {onViewDetails && (
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          View Details
        </Button>
      )}
      
      <EventShareMenu 
        eventId={eventId} 
        title={eventTitle} 
      />
      
      {canAddGuests && (
        <>
          <Button variant="outline" size="sm" onClick={() => setShowGuestDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Guests
          </Button>
          
          <EventGuestDialog
            open={showGuestDialog}
            onOpenChange={setShowGuestDialog}
            onSave={onRSVP}
            currentGuests={currentGuests}
            eventTitle={eventTitle}
          />
        </>
      )}
    </div>
  );
}
