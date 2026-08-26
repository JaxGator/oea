import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { eventDateOnly, eventPath, formatTimeRange, goingCount, type OeaEvent } from "@/lib/oea";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  event: OeaEvent;
  canManage?: boolean;
  onEdit?: (event: OeaEvent) => void;
}

export function EventListRow({ event, canManage, onEdit }: Props) {
  const date = eventDateOnly(event);
  const going = goingCount(event);

  return (
    <div className="flex flex-col gap-4 border-b border-border py-6 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex w-16 shrink-0 flex-col items-center rounded-xl bg-secondary py-2">
        <span className="font-display text-2xl font-extrabold leading-none">
          {String(date.getDate()).padStart(2, "0")}
        </span>
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          {WEEKDAYS[date.getDay()]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2">
          {event.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary"
            >
              {tag}
            </span>
          ))}
          {event.status === "draft" && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold uppercase text-muted-foreground">
              Draft
            </span>
          )}
          {event.status === "cancelled" && (
            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-bold uppercase text-destructive">
              Cancelled
            </span>
          )}
        </div>
        <h3 className="mt-1 font-display text-xl font-bold leading-snug">
          <Link to={eventPath(event)} className="hover:text-accent">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {[event.place || event.location, formatTimeRange(event), `${going} going`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {canManage && onEdit && (
          <Button variant="ghost" size="icon" aria-label="Edit event" onClick={() => onEdit(event)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        <Button asChild variant="outline" className="rounded-full font-semibold">
          <Link to={eventPath(event)}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}
