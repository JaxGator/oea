
import { Database } from './database';
import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type SchemaName = 'public' extends keyof Database ? 'public' : string & keyof Database;

// Improved type guards for database operations
export function isQueryError(error: unknown): error is PostgrestError {
  return error instanceof Error && 'code' in error;
}

export function assertQueryResult<T>(result: PostgrestResponse<T>): asserts result is PostgrestResponse<T> & { data: T[] } {
  if (!result.data) {
    throw new Error('Query result is null or undefined');
  }
}

// Strong typing for event with RSVP relationship
export type EventRSVPWithProfile = TablesRow<'event_rsvps'> & {
  profiles?: {
    full_name: string | null;
    username: string;
  } | null;
};

export type EventWithRSVPs = TablesRow<'events'> & {
  event_rsvps?: EventRSVPWithProfile[];
};

// Type guard for EventWithRSVPs
export function isEventWithRSVPs(data: unknown): data is EventWithRSVPs {
  if (!data || typeof data !== 'object') return false;
  
  const event = data as EventWithRSVPs;
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
