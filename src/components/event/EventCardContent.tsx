
import { Event } from "@/types/event";
import { EventDetailsSection } from "./card/sections/EventDetailsSection";
import { EventActionsSection } from "./card/sections/EventActionsSection";
import { AttendeeList } from "./details/AttendeeList";

interface EventCardContentProps {
  event: Event;
  rsvpCount: number;
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  waitlistEnabled?: boolean;
  waitlistCapacity?: number | null;
  currentGuests: { firstName: string }[];
  editedRSVPCount: string;
  isEditingRSVP: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
  onTogglePublish?: () => void;
  onEditRSVP: () => void;
  onSaveRSVP: () => void;
  onCancelEdit: () => void;
  onRSVPCountChange: (value: string) => void;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
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
  waitlistCapacity,
  currentGuests,
  editedRSVPCount,
  isEditingRSVP,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
  onEditRSVP,
  onSaveRSVP,
  onCancelEdit,
  onRSVPCountChange,
  isAuthChecking = false,
  requireAuth = false
}: EventCardContentProps) {
  // Process attendee names including guests
  const attendeeNames = event.rsvps?.reduce((names: string[], rsvp) => {
    // Add primary attendee
    if (rsvp.profiles) {
      names.push(rsvp.profiles.full_name || rsvp.profiles.username);
    }
    
    // Add guests if any
    if (rsvp.event_guests) {
      rsvp.event_guests.forEach(guest => {
        names.push(`${guest.first_name} (Guest of ${rsvp.profiles?.full_name || rsvp.profiles?.username})`);
      });
    }
    
    return names;
  }, []) || [];

  console.log('EventCardContent - Attendee names:', attendeeNames);

  return (
    <div className="p-4">
      <EventDetailsSection
        event={event}
        rsvpCount={rsvpCount}
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        isPastEvent={isPastEvent}
        waitlistEnabled={waitlistEnabled}
        waitlistCapacity={waitlistCapacity}
        editedRSVPCount={editedRSVPCount}
        isEditingRSVP={isEditingRSVP}
        onEditRSVP={onEditRSVP}
        onSaveRSVP={onSaveRSVP}
        onCancelEdit={onCancelEdit}
        onRSVPCountChange={onRSVPCountChange}
      />

      {attendeeNames.length > 0 && (
        <div className="mt-4 mb-4">
          <AttendeeList attendeeNames={attendeeNames} />
        </div>
      )}

      <EventActionsSection
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        userRSVPStatus={userRSVPStatus}
        isPastEvent={isPastEvent}
        canAddGuests={canAddGuests}
        currentGuests={currentGuests}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onEdit={onEdit}
        onDelete={onDelete}
        showPublishToggle={showPublishToggle}
        isPublished={isPublished}
        onViewDetails={onViewDetails}
        onTogglePublish={onTogglePublish}
        isAuthChecking={isAuthChecking}
        requireAuth={requireAuth}
        event={{ id: event.id, title: event.title }}
      />
    </div>
  );
}
