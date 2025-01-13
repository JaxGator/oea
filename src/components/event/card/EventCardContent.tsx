import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
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
  onTogglePublish: () => void;
  isPublished: boolean;
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
  onTogglePublish,
  isPublished,
  onViewDetails,
}: EventCardContentProps) {
  const [editedRSVPCount, setEditedRSVPCount] = useState(rsvpCount.toString());
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);

  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = waitlistEnabled && isFullyBooked && 
    (!waitlistCapacity || waitlistCount < waitlistCapacity);

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
          onSaveRSVP={() => {}}
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