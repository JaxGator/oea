
export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_guests: number;
  created_by: string;
  created_at: string;
  image_url: string;
  imported_rsvp_count?: number | null;
  is_featured?: boolean;
  waitlist_enabled?: boolean;
  waitlist_capacity?: number | null;
  is_published?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  end_time?: string | null;
  reminder_enabled?: boolean;
  reminder_intervals?: string[];
  requires_payment?: boolean;
  ticket_price?: number | null;
  rsvps?: EventRSVP[];
  attendees?: EventRSVP[];
  guests?: EventGuest[];
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: 'attending' | 'not_attending' | 'maybe';
  status: 'confirmed' | 'waitlisted';
  created_at: string;
  send_confirmation_email?: boolean;
  profiles?: {
    full_name: string | null;
    username: string;
  };
  event_guests?: EventGuest[];
}

export interface EventGuest {
  id: string;
  first_name: string;
}

export interface EventFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_guests: number;
  image_url: string;
  created_by?: string;
  is_featured?: boolean;
  waitlist_enabled?: boolean;
  waitlist_capacity?: number | null;
  reminder_enabled?: boolean;
  reminder_intervals?: string[];
  end_time?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  requires_payment?: boolean;
  ticket_price?: number | null;
}
