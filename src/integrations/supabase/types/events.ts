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
};

export type EventRSVP = {
  id: string;
  event_id: string;
  user_id: string;
  response: 'attending' | 'not_attending' | 'maybe';
  created_at: string;
};

export type EventGuest = {
  id: string;
  rsvp_id: string;
  first_name: string | null;
  created_at: string;
};