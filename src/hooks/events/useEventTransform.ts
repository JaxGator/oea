import { Event } from "@/types/event";

export const transformEventData = (data: any[]): Event[] => {
  return (data || []).map((event): Event => ({
    ...event,
    rsvps: event.rsvps?.map((rsvp: any) => ({
      ...rsvp,
      profiles: {
        full_name: rsvp.profiles?.full_name || null,
        username: rsvp.profiles?.username || ''
      }
    })) || []
  }));
};