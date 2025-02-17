
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

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_guests: number;
  created_by: string;
  created_at: string;
  image_url: string;
  is_featured?: boolean;
  waitlist_enabled?: boolean;
  waitlist_capacity?: number | null;
  is_published?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  end_time?: string | null;
  reminder_enabled?: boolean;
  reminder_intervals?: string[];
  requires_payment?: boolean;
  ticket_price?: number | null;
}

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
    // This will be handled by the AddGuestsButton component's internal logic
    console.log('Adding guests for event:', eventId, guests);
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    // Optionally, you could add a refetch mechanism here if needed
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
          event={selectedEvent}
          showDetailsDialog={showDetailsDialog}
          setShowDetailsDialog={setShowDetailsDialog}
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          rsvpCount={0}
          attendeeNames={[]}
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
