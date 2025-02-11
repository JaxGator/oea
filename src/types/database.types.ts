
import { Database } from '@/integrations/supabase/types/database'
import { TableRow, NonNullableFields } from './supabase'

// Basic table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Common table types with proper nullability handling
export type Profile = NonNullableFields<TableRow<'profiles'>>
export type Event = NonNullableFields<TableRow<'events'>>
export type EventRSVP = NonNullableFields<TableRow<'event_rsvps'>>
export type EventGuest = NonNullableFields<TableRow<'event_guests'>>
export type SocialMediaFeed = NonNullableFields<TableRow<'social_media_feeds'>>
export type Poll = NonNullableFields<TableRow<'polls'>>
export type PollOption = NonNullableFields<TableRow<'poll_options'>>
export type PollVote = NonNullableFields<TableRow<'poll_votes'>>

// Relationship types with proper type safety
export interface EventRSVPWithProfile extends EventRSVP {
  profiles?: Profile | null;
  event_guests?: EventGuest[];
}

export interface PollOptionWithVotes extends PollOption {
  vote_count?: number;
  has_voted?: boolean;
}

export interface PollWithDetails extends Poll {
  poll_options: PollOptionWithVotes[];
  total_votes?: number;
}

// Database function return types
export type VoteResult = 'success' | 'already_voted' | 'poll_closed' | 'not_found'

// View types with proper nullability
export interface PollVoteCount {
  poll_id: string;
  option_id: string;
  vote_count: number;
}

// Helper types for database queries with improved type safety
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never

// Type guard utilities
export function isPollWithDetails(value: unknown): value is PollWithDetails {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'poll_options' in value &&
    Array.isArray((value as PollWithDetails).poll_options)
  )
}

export function isEventRSVPWithProfile(value: unknown): value is EventRSVPWithProfile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'user_id' in value &&
    'event_id' in value
  )
}
