export interface EventGuest {
  id: string;
  rsvp_id: string;
  first_name: string | null;
  created_at: string;
}

export interface EventGuestInsert extends Omit<EventGuest, 'id' | 'created_at'> {
  id?: string;
  created_at?: string;
}

export interface EventGuestUpdate extends Partial<EventGuestInsert> {}