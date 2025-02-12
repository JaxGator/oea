
export type Event = {
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
  imported_rsvp_count: number | null;
  is_featured: boolean | null;
  waitlist_enabled?: boolean;
  waitlist_capacity?: number | null;
  end_time?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  reminder_enabled?: boolean;
  reminder_intervals?: string[];
  requires_payment?: boolean;
  ticket_price?: number | null;
};

export type EventRSVP = {
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
  } | null;
};

export type EventGuest = {
  id: string;
  rsvp_id: string;
  first_name: string | null;
  created_at: string;
};
