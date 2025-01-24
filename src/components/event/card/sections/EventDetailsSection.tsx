import { Event } from "@/types/event";
import { EventCardBasicInfo } from "../EventCardBasicInfo";
import { EventAdminEdit } from "../EventAdminEdit";

interface EventDetailsSectionProps {
  event: Event;
  rsvpCount: number;
  isAdmin: boolean;
  canManageEvents: boolean;
  isPastEvent: boolean;
  waitlistEnabled?: boolean;
  waitlistCapacity?: number | null;
  editedRSVPCount: string;
  isEditingRSVP: boolean;
  onEditRSVP: () => void;
  onSaveRSVP: () => void;
  onCancelEdit: () => void;
  onRSVPCountChange: (value: string) => void;
}

export function EventDetailsSection({
  event,
  rsvpCount,
  isAdmin,
  canManageEvents,
  isPastEvent,
  waitlistEnabled,
  waitlistCapacity,
  editedRSVPCount,
  isEditingRSVP,
  onEditRSVP,
  onSaveRSVP,
  onCancelEdit,
  onRSVPCountChange,
}: EventDetailsSectionProps) {
  return (
    <>
      <EventCardBasicInfo
        date={event.date}
        location={event.location}
        rsvpCount={rsvpCount}
        maxGuests={event.max_guests}
        isPastEvent={isPastEvent}
        canViewDetails={isAdmin || canManageEvents}
        waitlistEnabled={waitlistEnabled}
        waitlistCapacity={waitlistCapacity}
        isWixEvent={!!event.imported_rsvp_count}
        importedRsvpCount={event.imported_rsvp_count}
      />

      {(isAdmin || canManageEvents) && isPastEvent && (
        <EventAdminEdit
          isAdmin={isAdmin}
          isPastEvent={isPastEvent}
          editedRSVPCount={editedRSVPCount}
          onEditRSVP={onEditRSVP}
          onSaveRSVP={onSaveRSVP}
          onCancelEdit={onCancelEdit}
          onRSVPCountChange={onRSVPCountChange}
          isEditingRSVP={isEditingRSVP}
        />
      )}
    </>
  );
}