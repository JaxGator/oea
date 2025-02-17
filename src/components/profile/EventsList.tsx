
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRSVPCancellation } from "@/hooks/rsvp/useRSVPCancellation";
import { EventDialogs } from "@/components/event/dialogs/EventDialogs";
import { EventCard } from "./EventCard";
import { useEventRSVPs } from "@/hooks/events/useEventRSVPs";
import type { Event } from "@/types/event";

interface RSVP {
  id: string;
  events: Event;
  event_guests?: { firstName: string }[];
}

interface EventsListProps {
  events: RSVP[] | undefined;
  isLoading: boolean;
  emptyMessage: string;
  isPastEvents?: boolean;
}

export function EventsList({ events, isLoading, emptyMessage, isPastEvents = false }: EventsListProps) {
  const { cancelRSVP } = useRSVPCancellation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { profile } = useAuthState();

  const { data: eventRSVPs } = useEventRSVPs(selectedEvent?.id);

  // Fetch current user's RSVP status for all events
  const { data: userRSVPs } = useQuery({
    queryKey: ['user-rsvps', events?.map(e => e.events.id)],
    queryFn: async () => {
      if (!profile?.id || !events?.length) return null;

      const eventIds = events.map(e => e.events.id);
      
      const { data, error } = await supabase
        .from('event_rsvps')
        .select('event_id, response, status')
        .eq('user_id', profile.id)
        .in('event_id', eventIds);

      if (error) {
        console.error('Error fetching user RSVPs:', error);
        return null;
      }

      return data.reduce((acc, rsvp) => ({
        ...acc,
        [rsvp.event_id]: rsvp.response
      }), {} as Record<string, string>);
    },
    enabled: !!profile?.id && !!events?.length
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!events?.length) {
    return (
      <p className="text-center text-muted-foreground py-4">
        {emptyMessage}
      </p>
    );
  }

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsDialog(true);
  };

  const handleAddGuests = async (eventId: string, guests: { firstName: string }[]) => {
    console.log('Adding guests for event:', eventId, guests);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
  };

  const getAttendeeNames = () => {
    if (!eventRSVPs) return [];
    
    return eventRSVPs.flatMap(rsvp => {
      const names = [];
      if (rsvp.profiles) {
        names.push(rsvp.profiles.full_name || rsvp.profiles.username);
      }
      if (rsvp.event_guests && rsvp.event_guests.length > 0) {
        names.push(...rsvp.event_guests.map(guest => 
          `${guest.first_name} (Guest of ${rsvp.profiles?.full_name || rsvp.profiles?.username || 'Unknown'})`
        ));
      }
      return names;
    });
  };

  return (
    <div className="space-y-4">
      {events.map((rsvp) => (
        <EventCard
          key={rsvp.id}
          event={rsvp.events}
          guests={rsvp.event_guests}
          isPastEvent={isPastEvents}
          onViewDetails={handleViewDetails}
          onAddGuests={handleAddGuests}
          onCancelRSVP={cancelRSVP}
        />
      ))}

      {selectedEvent && (
        <EventDialogs
          event={{
            ...selectedEvent,
            rsvps: eventRSVPs || []
          }}
          showDetailsDialog={showDetailsDialog}
          setShowDetailsDialog={setShowDetailsDialog}
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          rsvpCount={eventRSVPs?.length || 0}
          attendeeNames={getAttendeeNames()}
          userRSVPStatus={userRSVPs?.[selectedEvent.id]}
          isAdmin={profile?.is_admin || false}
          canManageEvents={profile?.is_admin || false}
          isPastEvent={isPastEvents}
          isWixEvent={false}
          canAddGuests={!isPastEvents}
          currentGuests={[]}
          onRSVP={() => {}}
          onCancelRSVP={() => cancelRSVP(selectedEvent.id)}
          handleEditSuccess={handleEditSuccess}
          isAuthenticated={true}
        />
      )}
    </div>
  );
}
