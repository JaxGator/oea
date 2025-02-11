
import { Database } from './database';
import { PostgrestError } from '@supabase/supabase-js';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type SchemaName = 'public' extends keyof Database ? 'public' : string & keyof Database;

// Type guards for database operations
export function isQueryError(error: unknown): error is PostgrestError {
  return error instanceof Error && 'code' in error;
}

export function assertQueryResult<T>(result: T | null | undefined): asserts result is T {
  if (!result) {
    throw new Error('Query result is null or undefined');
  }
}

// Strongly typed event with RSVP relationship
export type EventWithRSVPs = TablesRow<'events'> & {
  event_rsvps?: Array<{
    id: string;
    event_id: string;
    user_id: string;
    response: string;
    created_at: string;
    status: string;
    profiles?: {
      full_name: string | null;
      username: string;
    } | null;
  }>;
};
