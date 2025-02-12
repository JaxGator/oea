
import type { Database as DatabaseGenerated } from '@/integrations/supabase/types/database'

export type { Database } from '@/integrations/supabase/types/database'
export type { Json } from '@/integrations/supabase/types/database'

// Common table types with proper nullability handling
export type Profile = DatabaseGenerated['public']['Tables']['profiles']['Row']
export type Event = DatabaseGenerated['public']['Tables']['events']['Row']
export type EventRSVP = DatabaseGenerated['public']['Tables']['event_rsvps']['Row']
export type EventGuest = DatabaseGenerated['public']['Tables']['event_guests']['Row']
export type Poll = DatabaseGenerated['public']['Tables']['polls']['Row']
export type PollOption = DatabaseGenerated['public']['Tables']['poll_options']['Row']
export type PollVote = DatabaseGenerated['public']['Tables']['poll_votes']['Row']
export type SocialMediaFeed = DatabaseGenerated['public']['Tables']['social_media_feeds']['Row']

// Type helpers for database operations
export type Tables<T extends keyof DatabaseGenerated['public']['Tables']> = DatabaseGenerated['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof DatabaseGenerated['public']['Tables']> = DatabaseGenerated['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof DatabaseGenerated['public']['Tables']> = DatabaseGenerated['public']['Tables'][T]['Update']

// Type guards for database operations
export function isQueryError<T>(result: T | { error: true }): result is { error: true } {
  return result && typeof result === 'object' && 'error' in result
}

export function isQuerySuccess<T>(result: T | { error: true }): result is T {
  return !isQueryError(result)
}

// Database operation result types
export type DbResult<T> = Promise<T | { error: true }>
export type DbResultOk<T> = Promise<T>

export type QueryResult<T> = {
  data: T | null
  error: {
    message: string
    code?: string
    details?: string
  } | null
}
