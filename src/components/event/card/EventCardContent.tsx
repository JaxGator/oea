import { useState } from "react";
import { Event } from "@/types/event";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { EventCardActions } from "./EventCardActions";
import { EventAdminEdit } from "./EventAdminEdit";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventCardContentProps {
  event: Event;
  rsvpCount: number;
  isAdmin: boolean;
  canManageEvents: boolean;
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
  onTogglePublish?: () => void;
  isPublished: boolean;
  onViewDetails: () => void;
}

export function EventCardContent({
  event,
  rsvpCount,
  isAdmin,
  canManageEvents,
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
  onTogglePublish,
  isPublished,
  onViewDetails,
}: EventCardContentProps) {
  const [editedRSVPCount, setEditedRSVPCount] = useState(rsvpCount.toString());
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);

  const handleSaveRSVP = async () => {
    try {
      const newCount = parseInt(editedRSVPCount);
      if (isNaN(newCount) || newCount < 0) {
        toast.error("Please enter a valid number");
        return;
      }

      const { error } = await supabase
        .from('events')
        .update({ imported_rsvp_count: newCount })
        .eq('id', event.id);

      if (error) throw error;

      toast.success("RSVP count updated successfully");
      setIsEditingRSVP(false);
    } catch (error) {
      console.error('Error updating RSVP count:', error);
      toast.error("Failed to update RSVP count");
    }
  };

  return (
    <>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-4 flex-1">
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
        </div>

        <EventAdminEdit
          isAdmin={isAdmin}
          isPastEvent={isPastEvent}
          editedRSVPCount={editedRSVPCount}
          onEditRSVP={() => setIsEditingRSVP(true)}
          onSaveRSVP={handleSaveRSVP}
          onCancelEdit={() => {
            setIsEditingRSVP(false);
            setEditedRSVPCount(rsvpCount.toString());
          }}
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
          canManageEvents={canManageEvents}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={rsvpCount >= event.max_guests}
          canJoinWaitlist={waitlistEnabled && rsvpCount >= event.max_guests && 
            (!waitlistCapacity || waitlistCount < waitlistCapacity)}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          isPastEvent={isPastEvent}
          isWixEvent={event.description === 'Imported from Wix'}
          isPublished={isPublished}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
        />
      </CardFooter>
    </>
  );
}