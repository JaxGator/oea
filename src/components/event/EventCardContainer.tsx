import { Event } from "@/types/event";
import { EventCardWrapper } from "./EventCardWrapper";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardContent } from "./card/EventCardContent";
import { EventDialogs } from "./dialogs/EventDialogs";
import { useEventCard } from "@/hooks/useEventCard";
import { useEventDialogs } from "@/hooks/useEventDialogs";
import { useEventInteraction } from "@/hooks/events/useEventInteraction";
import { EventRSVPHandler } from "./rsvp/EventRSVPHandler";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EventCardContainerProps {
  event: Event;
  onRSVP: (eventId: string, guests?: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
}

export function EventCardContainer({
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus,
  onUpdate
}: EventCardContainerProps) {
  const { 
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleDelete,
  } = useEventCard(event.id, onUpdate);

  const { showEditDialog, setShowEditDialog } = useEventDialogs();
  const { showDetailsDialog, setShowDetailsDialog, handleInteraction } = useEventInteraction();

  // Fetch waitlist count
  const { data: waitlistCount = 0 } = useQuery({
    queryKey: ['waitlist-count', event.id],
    queryFn: async () => {
      if (!event.waitlist_enabled) return 0;
      const { count, error } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('status', 'waitlisted');
      
      if (error) {
        console.error('Error fetching waitlist count:', error);
        return 0;
      }
      return count || 0;
    },
    enabled: !!event.waitlist_enabled
  });

  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));
  const isWixEvent = event.description === 'Imported from Wix';
  const canAddGuests = isAdmin || userRSVPStatus === 'attending';

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  return (
    <EventRSVPHandler eventId={event.id} onRSVP={onRSVP}>
      {(handleRSVP) => (
        <>
          <EventCardWrapper
            title={event.title}
            onInteraction={handleInteraction}
            onKeyDown={handleInteraction}
          >
            <EventCardHeader imageUrl={event.image_url} title={event.title} />
            <EventCardContent
              date={event.date}
              location={event.location}
              rsvpCount={rsvpCount}
              maxGuests={event.max_guests}
              isWixEvent={isWixEvent}
              isAdmin={isAdmin}
              userRSVPStatus={userRSVPStatus || null}
              isPastEvent={isPastEvent}
              canAddGuests={canAddGuests}
              waitlistEnabled={event.waitlist_enabled}
              waitlistCount={waitlistCount}
              waitlistCapacity={event.waitlist_capacity}
              isFeatured={event.is_featured}
              onRSVP={handleRSVP}
              onCancelRSVP={() => onCancelRSVP(event.id)}
              onEdit={() => setShowEditDialog(true)}
              onDelete={handleDelete}
            />
          </EventCardWrapper>

          <EventDialogs
            event={event}
            showDetailsDialog={showDetailsDialog}
            setShowDetailsDialog={setShowDetailsDialog}
            showEditDialog={showEditDialog}
            setShowEditDialog={setShowEditDialog}
            rsvpCount={rsvpCount}
            attendeeNames={attendeeNames}
            userRSVPStatus={userRSVPStatus || null}
            isAdmin={isAdmin}
            isPastEvent={isPastEvent}
            isWixEvent={isWixEvent}
            canAddGuests={canAddGuests}
            onRSVP={handleRSVP}
            onCancelRSVP={() => onCancelRSVP(event.id)}
            onDelete={handleDelete}
            handleEditSuccess={handleEditSuccess}
          />
        </>
      )}
    </EventRSVPHandler>
  );
}