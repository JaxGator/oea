import { EventRSVP } from "@/types/event";

interface AttendeeWithGuests {
  profile: {
    full_name: string | null;
    username: string | null;
  };
  event_guests?: {
    first_name: string;
  }[];
}

export function processAttendeeNames(attendees: AttendeeWithGuests[]): string[] {
  return attendees.reduce((names: string[], attendee) => {
    // Add the primary attendee name
    if (attendee.profile) {
      const name = attendee.profile.full_name || attendee.profile.username || '';
      if (name) names.push(name);
    }
    
    // Add guest names if any
    if (attendee.event_guests && attendee.event_guests.length > 0) {
      attendee.event_guests.forEach(guest => {
        if (guest.first_name) {
          names.push(`${guest.first_name} (Guest of ${attendee.profile?.full_name || attendee.profile?.username || 'Unknown'})`);
        }
      });
    }
    
    return names;
  }, []);
}