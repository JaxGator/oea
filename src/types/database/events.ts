
import { Json } from './base';
import type { Profile } from './profiles';

export interface EventsTable {
  Row: {
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
    is_featured: boolean;
    is_published: boolean;
    imported_rsvp_count: number | null;
    waitlist_enabled: boolean;
    waitlist_capacity: number | null;
    end_time: string | null;
    latitude: number | null;
    longitude: number | null;
    reminder_enabled: boolean;
    reminder_intervals: string[];
    requires_payment: boolean;
    ticket_price: number | null;
  };
  Insert: {
    id?: string;
    title: string;
    description?: string | null;
    date: string;
    time: string;
    location: string;
    max_guests: number;
    created_by: string;
    created_at?: string;
    image_url: string;
    is_featured?: boolean;
    is_published?: boolean;
    imported_rsvp_count?: number | null;
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
  Update: {
    id?: string;
    title?: string;
    description?: string | null;
    date?: string;
    time?: string;
    location?: string;
    max_guests?: number;
    created_by?: string;
    created_at?: string;
    image_url?: string;
    is_featured?: boolean;
    is_published?: boolean;
    imported_rsvp_count?: number | null;
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
}

export type Event = EventsTable['Row'] & {
  rsvps?: EventRSVP[];
  attendees?: Profile[];
  guests?: EventGuest[];
};

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
