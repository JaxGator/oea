
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
  const canViewRSVPs = true; // Allow all users to view RSVPs

  // Process attendee names from RSVPs and their guests
  const processedAttendeeNames = event.rsvps
    ?.filter(rsvp => rsvp.response === 'attending' && rsvp.status === 'confirmed')
    .flatMap(rsvp => {
      const names = [];
      // Add the main RSVP holder
      if (rsvp.profiles?.username) {
        names.push(rsvp.profiles.username);
      }
      // Add their guests if any
      if (rsvp.event_guests && rsvp.event_guests.length > 0) {
        names.push(...rsvp.event_guests.map(guest => 
          `${guest.first_name} (Guest of ${rsvp.profiles?.username})`
        ));
      }
      return names;
    }) || [];

  // Process waitlist names
  const waitlistNames = event.rsvps
    ?.filter(rsvp => rsvp.status === 'waitlisted')
    .map(rsvp => rsvp.profiles?.username)
    .filter(name => name) || [];

  console.log('EventCardDetailedView - Attendees:', { 
    processedAttendeeNames,
    rsvpCount,
    userRSVPStatus,
    canViewRSVPs,
    event
  });

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
