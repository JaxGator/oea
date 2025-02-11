
import { Database } from '@/integrations/supabase/types/database'

// Base table types
export type Tables = Database['public']['Tables']
export type TableRow<T extends keyof Tables> = Tables[T]['Row']
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update']

// Enum types
export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'failed'
export type RecipientType = 'all' | 'list' | 'individual'
export type PollStatus = 'draft' | 'active' | 'closed'
export type PollVisibility = 'public' | 'private'
export type NotificationType = 'event_reminder' | 'message' | 'poll_share' | 'waitlist'

// Type guards
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

// Query result types
export type QueryResult<T> = {
  data: T | null
  error: null | {
    message: string
    code?: string
    details?: string
  }
}

// Utility type for handling nullable fields
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

// Utility type for handling optional fields
export type OptionalFields<T> = {
  [P in keyof T]?: T[P]
}
