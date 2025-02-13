
import { Json } from './base';
import type { Profile } from './profiles';
import type { EventGuest } from './events';

export interface EventRSVPsTable {
  Row: {
    id: string;
    event_id: string;
    user_id: string;
    response: 'attending' | 'not_attending' | 'maybe';
    status: 'confirmed' | 'waitlisted';
    created_at: string;
    send_confirmation_email: boolean;
    profiles?: Profile;
    event_guests?: EventGuest[];
  };
  Insert: {
    id?: string;
    event_id: string;
    user_id: string;
    response: 'attending' | 'not_attending' | 'maybe';
    status?: 'confirmed' | 'waitlisted';
    created_at?: string;
    send_confirmation_email?: boolean;
  };
  Update: {
    id?: string;
    event_id?: string;
    user_id?: string;
    response?: 'attending' | 'not_attending' | 'maybe';
    status?: 'confirmed' | 'waitlisted';
    created_at?: string;
    send_confirmation_email?: boolean;
  };
}
