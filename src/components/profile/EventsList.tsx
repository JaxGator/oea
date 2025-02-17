
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

// Define the shape of the raw data from Supabase
interface RawSupabaseRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    full_name: string | null;
  };
  event_guests: {
    id: string;
    first_name: string;
  }[] | null;
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

      const { data: rawData, error } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          event_id,
          user_id,
          response,
          status,
          created_at,
          profiles!inner (
            id,
            username,
            full_name
          ),
          event_guests (
            id,
            first_name
          )
        `)
        .eq('event_id', selectedEvent.id)
        .eq('response', 'attending')
        .eq('status', 'confirmed');

      if (error) {
        console.error('Error fetching RSVPs:', error);
        return null;
      }

      // Transform the raw data into EventRSVP type
      const transformedData = (rawData as unknown as RawSupabaseRSVP[]).map(rsvp => ({
        id: rsvp.id,
        event_id: rsvp.event_id,
        user_id: rsvp.user_id,
        response: rsvp.response,
        status: rsvp.status,
        created_at: rsvp.created_at,
        profiles: {
          username: rsvp.profiles.username,
          full_name: rsvp.profiles.full_name || rsvp.profiles.username
        },
        event_guests: rsvp.event_guests?.map(guest => ({
          id: guest.id,
          first_name: guest.first_name
        })) || []
      }));

      return transformedData as EventRSVP[];
    },
    enabled: !!selectedEvent?.id
  });

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

  // Process attendee names from RSVPs and their guests
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
