
import { Event } from "@/types/event";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { WaitlistInfo } from "./WaitlistInfo";
import { AttendeeList } from "../details/AttendeeList";
import { EventImageSection } from "./sections/EventImageSection";
import { EventActionsSection } from "./sections/EventActionsSection";
import { EventDetails } from "../EventDetails";
import { useAuthState } from "@/hooks/useAuthState";

interface EventCardDetailedViewProps {
  event: Event;
  rsvpCount: number;
  attendeeNames: string[];
  userRSVPStatus: string | null;
  isAdmin: boolean;
  canManageEvents: boolean;
  isPastEvent: boolean;
  isWixEvent: boolean;
  canAddGuests: boolean;
  currentGuests?: { firstName: string }[];
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  isAuthenticated?: boolean;
}

export function EventCardDetailedView({
  event,
  rsvpCount,
  attendeeNames,
  userRSVPStatus,
  isAdmin,
  canManageEvents,
  isPastEvent,
  isWixEvent,
  canAddGuests,
  currentGuests = [],
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onTogglePublish,
  isAuthenticated = false,
}: EventCardDetailedViewProps) {
  const isFullyBooked = rsvpCount >= event.max_guests;
  const canJoinWaitlist = event.waitlist_enabled && isFullyBooked;
  const canViewRSVPs = isAdmin || canManageEvents || userRSVPStatus === "attending";

  // Process the event RSVPs to create attendee names list
  const processedAttendeeNames = event.rsvps?.reduce((names: string[], rsvp) => {
    if (rsvp.response === 'attending' && rsvp.status === 'confirmed') {
      // Add the main RSVP holder
      const attendeeName = rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown';
      names.push(attendeeName);

      // Add any guests associated with this RSVP
      if (rsvp.event_guests?.length) {
        rsvp.event_guests.forEach(guest => {
          names.push(`${guest.first_name} (Guest of ${attendeeName})`);
        });
      }
    }
    return names;
  }, []) || [];

  // Process waitlist names
  const waitlistNames = event.rsvps?.reduce((names: string[], rsvp) => {
    if (rsvp.status === 'waitlisted') {
      const attendeeName = rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown';
      names.push(attendeeName);
    }
    return names;
  }, []) || [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <EventImageSection imageUrl={event.image_url} title={event.title} />

      <div className="px-6 space-y-6">
        <EventCardBasicInfo
          date={event.date}
          time={event.time || '00:00:00'}
          location={event.location}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          isWixEvent={isWixEvent}
          waitlistEnabled={event.waitlist_enabled}
          waitlistCapacity={event.waitlist_capacity}
          importedRsvpCount={event.imported_rsvp_count}
          isPastEvent={isPastEvent}
        />
        
        <EventDetails event={event} />

        {canViewRSVPs && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Event Attendees</h3>
            <AttendeeList
              attendeeNames={processedAttendeeNames}
              waitlistNames={waitlistNames}
            />
          </div>
        )}

        {event.description && (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.description }} />
          </div>
        )}

        <EventActionsSection
          isAdmin={isAdmin}
          canManageEvents={canManageEvents}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={isFullyBooked}
          canJoinWaitlist={canJoinWaitlist}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          isPublished={event.is_published}
          showPublishToggle={true}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
          event={{ id: event.id, title: event.title }}
          isAuthenticated={isAuthenticated}
        />

        {event.waitlist_enabled && (
          <WaitlistInfo
            waitlistEnabled={event.waitlist_enabled}
            waitlistCount={waitlistNames.length}
            waitlistCapacity={event.waitlist_capacity}
          />
        )}
      </div>
    </div>
  );
}
