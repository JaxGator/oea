import { Event, EventRSVP } from "@/types/event";
import { TablesRow } from "@/utils/supabase-helpers";

type EventWithRsvps = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string | null;
  max_guests: number;
  created_by: string;
  created_at: string;
  image_url: string;
  imported_rsvp_count: number | null;
  is_featured: boolean | null;
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
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location || '',
    max_guests: event.max_guests,
    created_by: event.created_by,
    created_at: event.created_at,
    image_url: event.image_url,
    imported_rsvp_count: event.imported_rsvp_count,
    is_featured: event.is_featured,
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