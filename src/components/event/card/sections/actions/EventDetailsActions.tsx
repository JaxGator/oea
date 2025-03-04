
import { Button } from "@/components/ui/button";
import { UserPlus, Share2, Info } from "lucide-react";
import { EventShareMenu } from "@/components/event/share/EventShareMenu";
import { EventGuestDialog } from "@/components/event/guests/EventGuestDialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSaveGuests = async (guests: { firstName: string }[]) => {
    setIsSaving(true);
    try {
      await onRSVP(guests);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className={`flex ${isMobile ? 'flex-col w-full' : 'items-center'} gap-2`}>
      {onViewDetails && (
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "sm"} 
          onClick={onViewDetails}
          className={isMobile ? "w-full justify-center" : ""}
        >
          <Info className="h-4 w-4 mr-2" />
          View Details
        </Button>
      )}
      
      <EventShareMenu 
        eventId={eventId} 
        title={eventTitle} 
      />
      
      {canAddGuests && (
        <>
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "sm"} 
            onClick={() => setShowGuestDialog(true)}
            className={isMobile ? "w-full justify-center" : ""}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Manage Guests
          </Button>
          
          <EventGuestDialog
            open={showGuestDialog}
            onOpenChange={setShowGuestDialog}
            onSave={handleSaveGuests}
            currentGuests={currentGuests}
            eventTitle={eventTitle}
            isSaving={isSaving}
          />
        </>
      )}
    </div>
  );
}
