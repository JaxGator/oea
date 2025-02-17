
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRSVPCancellation } from "@/hooks/rsvp/useRSVPCancellation";
import { AddGuestsButton } from "@/components/event/actions/AddGuestsButton";
import { useState } from "react";
import { EventDialogs } from "@/components/event/dialogs/EventDialogs";
import { useAuthState } from "@/hooks/useAuthState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Event, EventRSVP } from "@/types/event";

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
  const navigate = useNavigate();
  const { cancelRSVP } = useRSVPCancellation();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { profile } = useAuthState();

  // Fetch event RSVPs when an event is selected
  const { data: eventRSVPs } = useQuery({
    queryKey: ['event-rsvps', selectedEvent?.id],
    queryFn: async () => {
      if (!selectedEvent?.id) return null;

      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          event_id,
          user_id,
          response,
          status,
          created_at,
          profiles:profiles(username, full_name),
          event_guests(first_name)
        `)
        .eq('event_id', selectedEvent.id)
        .eq('response', 'attending')
        .eq('status', 'confirmed');

      if (error) throw error;
      return data as EventRSVP[];
    },
    enabled: !!selectedEvent?.id
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

  // Process attendee names from RSVPs and their guests
  const getAttendeeNames = () => {
    if (!eventRSVPs) return [];
    
    return eventRSVPs.flatMap(rsvp => {
      const names = [];
      // Add the main RSVP holder
      if (rsvp.profiles && (rsvp.profiles.username || rsvp.profiles.full_name)) {
        names.push(rsvp.profiles.full_name || rsvp.profiles.username);
      }
      // Add their guests if any
      if (rsvp.event_guests && rsvp.event_guests.length > 0) {
        names.push(...rsvp.event_guests.map(guest => 
          `${guest.first_name} (Guest of ${rsvp.profiles ? rsvp.profiles.full_name || rsvp.profiles.username : 'Unknown'})`
        ));
      }
      return names;
    });
  };

  return (
    <div className="space-y-4">
      {events.map((rsvp) => (
        <Card key={rsvp.id}>
          <CardHeader>
            <CardTitle>{rsvp.events.title}</CardTitle>
            <CardDescription>
              {format(new Date(`${rsvp.events.date} ${rsvp.events.time}`), 'PPp')}
              <br />
              {rsvp.events.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rsvp.event_guests && rsvp.event_guests.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Guests: {rsvp.event_guests.map(guest => guest.firstName).join(', ')}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleViewDetails(rsvp.events)}
            >
              View Details
            </Button>
            {!isPastEvents && (
              <>
                <AddGuestsButton
                  onAddGuests={(guests) => handleAddGuests(rsvp.events.id, guests)}
                  currentGuests={rsvp.event_guests || []}
                />
                <Button
                  variant="destructive"
                  onClick={() => cancelRSVP(rsvp.events.id)}
                >
                  Cancel RSVP
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
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
          userRSVPStatus="attending"
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
