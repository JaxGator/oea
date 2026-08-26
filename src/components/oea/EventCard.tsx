import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventDateOnly, eventPath, formatTimeRange, goingCount, type OeaEvent } from "@/lib/oea";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function EventCard({ event }: { event: OeaEvent }) {
  const date = eventDateOnly(event);
  const going = goingCount(event);
  const primaryTag = event.tags?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform duration-200 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {primaryTag && (
            <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground">
              {primaryTag}
            </span>
          )}
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
            {MONTHS[date.getMonth()]} {date.getDate()}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{event.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{event.place || event.location}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{formatTimeRange(event)}</span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {going} going
          </span>
          {event.difficulty && <span className="font-medium text-foreground">{event.difficulty}</span>}
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-5 w-full rounded-full border-primary font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link to={eventPath(event)}>RSVP / Details</Link>
        </Button>
      </div>
    </article>
  );
}
