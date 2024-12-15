export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_guests: number;
  image_url: string;
  created_by: {
    username: string;
  };
  created_at: string;
  rsvps: {
    id: string;
    event_id: string;
    user_id: string;
    response: 'attending' | 'not_attending' | 'maybe';
    created_at: string;
  }[];
}