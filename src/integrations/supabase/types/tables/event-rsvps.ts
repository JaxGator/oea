export type RSVPResponse = 'attending' | 'not_attending' | 'maybe';

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  response: RSVPResponse;
  created_at: string;
}

export type EventRSVPInsert = Omit<EventRSVP, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export type EventRSVPUpdate = Partial<EventRSVP>;