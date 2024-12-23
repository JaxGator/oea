import { Event } from "@/types/event";
import { TablesRow } from "@/utils/supabase-helpers";

type EventWithRsvps = TablesRow<'events'> & {
  event_rsvps?: Array<{
    id: string;
    response: string;
    profiles?: {
      full_name: string | null;
      username: string;
    } | null;
  }>;
};

export const transformEventData = (data: EventWithRsvps[]): Event[] => {
  return (data || []).map((event): Event => ({
    ...event,
    rsvps: event.event_rsvps?.map((rsvp) => ({
      ...rsvp,
      profiles: {
        full_name: rsvp.profiles?.full_name || null,
        username: rsvp.profiles?.username || ''
      }
    })) || []
  }));
};