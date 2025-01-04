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
  rsvps?: EventRSVP[];
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: 'attending' | 'not_attending' | 'maybe';
  created_at: string;
  profiles: {
    id?: string;
    full_name: string | null;
    username: string;
  };
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
}