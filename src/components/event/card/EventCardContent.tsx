import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventCardActions } from "./EventCardActions";
import { EventAdminEdit } from "./EventAdminEdit";

interface EventCardContentProps {
  event: Event;
  rsvpCount: number;
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

export function EventCardContent({
  event,
  rsvpCount,
  isAdmin,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onViewDetails,
}: EventCardContentProps) {
  const [editedRSVPCount, setEditedRSVPCount] = useState(rsvpCount.toString());
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);

  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = waitlistEnabled && isFullyBooked && 
    (!waitlistCapacity || waitlistCount < waitlistCapacity);

  const handleRSVPEdit = async () => {
    const newCount = parseInt(editedRSVPCount);
    if (isNaN(newCount) || newCount < 0) {
      toast({
        title: "Invalid count",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .update({ imported_rsvp_count: newCount })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "RSVP count updated successfully",
      });
      setIsEditingRSVP(false);
    } catch (error) {
      console.error('Error updating RSVP count:', error);
      toast({
        title: "Error",
        description: "Failed to update RSVP count",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <EventCardBasicInfo
            date={event.date}
            location={event.location}
            rsvpCount={rsvpCount}
            maxGuests={event.max_guests}
            isWixEvent={event.description === 'Imported from Wix'}
            waitlistEnabled={waitlistEnabled}
            waitlistCount={waitlistCount}
            waitlistCapacity={waitlistCapacity}
            importedRsvpCount={event.imported_rsvp_count}
            isPastEvent={isPastEvent}
          />
        </div>

        <EventAdminEdit
          isAdmin={isAdmin}
          isPastEvent={isPastEvent}
          editedRSVPCount={editedRSVPCount}
          onEditRSVP={() => setIsEditingRSVP(true)}
          onSaveRSVP={handleRSVPEdit}
          onCancelEdit={() => setIsEditingRSVP(false)}
          onRSVPCountChange={setEditedRSVPCount}
        />

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewDetails}
          className="w-full mt-2"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <EventCardActions
          isAdmin={isAdmin}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={isFullyBooked}
          canJoinWaitlist={canJoinWaitlist}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          isPastEvent={isPastEvent}
          isWixEvent={event.description === 'Imported from Wix'}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
        />
      </CardFooter>
    </>
  );
}