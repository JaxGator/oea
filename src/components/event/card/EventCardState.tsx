import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface EventCardStateProps {
  event: Event;
  confirmedCount: number;
  waitlistCount: number;
}

export function EventCardState({ event, confirmedCount, waitlistCount }: EventCardStateProps) {
  const isWixEvent = Boolean(event.imported_rsvp_count);
  const totalAttendees = isWixEvent ? event.imported_rsvp_count || 0 : confirmedCount;
  const spotsLeft = event.max_guests - totalAttendees;
  const isFullyBooked = spotsLeft <= 0;
  const isPastEvent = new Date(event.date) < new Date();

  const renderSpotsBadge = () => {
    if (isPastEvent) {
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          Event Ended
        </Badge>
      );
    }

    if (isFullyBooked) {
      return (
        <Badge variant="destructive">
          Fully Booked
          {event.waitlist_enabled && waitlistCount > 0 && ` (${waitlistCount} on waitlist)`}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-green-500 text-green-600">
        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(`${event.date}T${event.time}`), 'h:mm a')}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {totalAttendees} / {event.max_guests} attendees
          </span>
        </div>
      </div>

      <div className={cn("flex flex-wrap gap-2", isPastEvent && "opacity-50")}>
        {renderSpotsBadge()}
        {event.is_featured && (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Featured Event
          </Badge>
        )}
      </div>
    </div>
  );
}