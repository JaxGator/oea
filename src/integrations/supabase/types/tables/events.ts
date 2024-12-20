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
  imported_rsvp_count?: number;
}

export type EventInsert = Omit<Event, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type EventUpdate = Partial<Event>;