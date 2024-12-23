import { Event, EventRSVP } from "@/types/event";
import { TablesRow } from "@/utils/supabase-helpers";

type EventWithRsvps = TablesRow<'events'> & {
  event_rsvps?: Array<{
    id: string;
    event_id: string;
    user_id: string;
    response: 'attending' | 'not_attending' | 'maybe';
    created_at: string;
    profiles?: {
      full_name: string | null;
      username: string;
    } | null;
  }>;
};

export const transformEventData = (data: EventWithRsvps[]): Event[] => {
  return (data || []).map((event): Event => ({
    ...event,
    rsvps: event.event_rsvps?.map((rsvp): EventRSVP => ({
      id: rsvp.id,
      event_id: rsvp.event_id,
      user_id: rsvp.user_id,
      response: rsvp.response,
      created_at: rsvp.created_at,
      profiles: {
        full_name: rsvp.profiles?.full_name || null,
        username: rsvp.profiles?.username || ''
      }
    })) || []
  }));
};