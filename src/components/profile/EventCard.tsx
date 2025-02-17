
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddGuestsButton } from "@/components/event/actions/AddGuestsButton";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  guests?: { firstName: string }[];
  isPastEvent: boolean;
  onViewDetails: (event: Event) => void;
  onAddGuests: (eventId: string, guests: { firstName: string }[]) => void;
  onCancelRSVP: (eventId: string) => void;
}

export function EventCard({ 
  event, 
  guests = [], 
  isPastEvent,
  onViewDetails,
  onAddGuests,
  onCancelRSVP
}: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>
          {format(new Date(`${event.date} ${event.time}`), 'PPp')}
          <br />
          {event.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {guests.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Guests: {guests.map(guest => guest.firstName).join(', ')}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onViewDetails(event)}
        >
          View Details
        </Button>
        {!isPastEvent && (
          <>
            <AddGuestsButton
              onAddGuests={(newGuests) => onAddGuests(event.id, newGuests)}
              currentGuests={guests}
            />
            <Button
              variant="destructive"
              onClick={() => onCancelRSVP(event.id)}
            >
              Cancel RSVP
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
