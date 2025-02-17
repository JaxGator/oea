
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRSVPCancellation } from "@/hooks/rsvp/useRSVPCancellation";
import { AddGuestsButton } from "@/components/event/actions/AddGuestsButton";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
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

  const handleViewDetails = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleAddGuests = async (eventId: string, guests: { firstName: string }[]) => {
    // This will be handled by the AddGuestsButton component's internal logic
    console.log('Adding guests for event:', eventId, guests);
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
              onClick={() => handleViewDetails(rsvp.events.id)}
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
    </div>
  );
}
