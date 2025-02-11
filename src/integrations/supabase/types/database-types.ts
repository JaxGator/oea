
import { Database } from './database';
import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

// Better type guards for database operations
export function isQueryError(error: unknown): error is PostgrestError {
  return error instanceof Error && 'code' in error;
}

export function assertQueryResult<T>(result: PostgrestResponse<T>): asserts result is PostgrestResponse<T> & { data: T[] } {
  if (result.error) throw result.error;
  if (!result.data) throw new Error('Query returned no data');
}

// Base event type
export type EventRow = TablesRow<'events'>;

// Base RSVP type
export type RSVPRow = TablesRow<'event_rsvps'>;

// Base profile type
export type ProfileRow = TablesRow<'profiles'>;

// Strong typing for event with RSVP relationship
export type EventRSVPWithProfile = RSVPRow & {
  profiles?: ProfileRow | null;
};

export type EventWithRSVPs = EventRow & {
  event_rsvps?: EventRSVPWithProfile[];
};

// Type guard for EventWithRSVPs
export function isEventWithRSVPs(data: unknown): data is EventWithRSVPs {
  if (!data || typeof data !== 'object') return false;
  
  const event = data as EventRow;
  return (
    'id' in event &&
    'title' in event &&
    'date' in event &&
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.date === 'string'
  );
}

// Helper function to safely transform database results
export function transformEventData(data: EventWithRSVPs): EventWithRSVPs {
  return {
    ...data,
    event_rsvps: data.event_rsvps?.map(rsvp => ({
      ...rsvp,
      profiles: rsvp.profiles || null
    })) || []
  };
}
