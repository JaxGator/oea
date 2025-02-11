
import { Database } from '@/integrations/supabase/types/database'
import { PostgrestError } from '@supabase/supabase-js'

// Base table types
export type Tables = Database['public']['Tables']
export type TableRow<T extends keyof Tables> = Tables[T]['Row']
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update']

// Enum types with strict definitions
export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'failed'
export type RecipientType = 'all' | 'list' | 'individual'
export type PollStatus = 'draft' | 'active' | 'closed'
export type PollVisibility = 'public' | 'private'
export type NotificationType = 'event_reminder' | 'message' | 'poll_share' | 'waitlist'

// Improved type guards
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  )
}

// Query result types with improved error details
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
  [P in keyof T]-?: NonNullable<T[P]>
}

// Utility type for handling optional fields
export type OptionalFields<T> = {
  [P in keyof T]?: T[P]
}

// Database specific types
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
