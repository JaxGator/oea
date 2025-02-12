
import type { Database as DatabaseGenerated } from '@/integrations/supabase/types/database';

export type Database = DatabaseGenerated;
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Extended types
export type PollWithDetails = Database['public']['Tables']['polls']['Row'] & {
  poll_options: (Database['public']['Tables']['poll_options']['Row'] & {
    has_voted?: boolean;
    vote_count?: number;
  })[];
  total_votes?: number;
};

export type VoteResult = 'success' | 'already_voted' | 'poll_closed' | 'not_found';

// Common table types with proper nullability handling
export type Profile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  is_admin: boolean;
  is_approved: boolean;
  is_member: boolean;
  email: string | null;
  event_reminders_enabled: boolean;
  email_notifications: boolean;
  in_app_notifications: boolean;
  interests: string[] | null;
  updated_at: string | null;
  leaderboard_opt_out: boolean;
};

export type Event = Database['public']['Tables']['events']['Row'] & {
  rsvps?: EventRSVP[];
  attendees?: Profile[];
  guests?: EventGuest[];
};

export type EventRSVP = Database['public']['Tables']['event_rsvps']['Row'] & {
  event_id: string;
  profiles?: Profile | null;
  event_guests?: EventGuest[];
};

export type EventGuest = Database['public']['Tables']['event_guests']['Row'];

// Event with RSVP relationship
export interface EventRSVPWithProfile extends EventRSVP {
  profiles?: Profile;
  event_guests?: EventGuest[];
}

// Type helpers for database operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Type guards for database operations
export function isQueryError<T>(result: T | { error: true }): result is { error: true } {
  return result && typeof result === 'object' && 'error' in result;
}

export function isQuerySuccess<T>(result: T | { error: true }): result is T {
  return !isQueryError(result);
}

// Database operation result types
export type DbResult<T> = Promise<T | { error: true }>;
export type DbResultOk<T> = Promise<T>;

export type QueryResult<T> = {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: string;
  } | null;
};

// RSVPs and response types
export type RSVPResponse = 'attending' | 'not_attending' | 'maybe';
export type RSVPStatus = 'confirmed' | 'waitlisted';

// Additional types needed for query responses
export interface EventsResponse {
  events: Event[];
  totalCount: number;
  nextPage: number | null;
}

export interface PollVoteCount {
  poll_id: string;
  option_id: string;
  vote_count: number;
}
