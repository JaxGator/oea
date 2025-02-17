
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
}

interface EventsListProps {
  events: RSVP[] | undefined;
  isLoading: boolean;
  emptyMessage: string;
}

export function EventsList({ events, isLoading, emptyMessage }: EventsListProps) {
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
        </Card>
      ))}
    </div>
  );
}
