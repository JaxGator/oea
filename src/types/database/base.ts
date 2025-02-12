
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

import type { SupabaseClient, PostgrestResponse, PostgrestError } from '@supabase/supabase-js'
import type { Profile } from '@/types/auth'

export interface DatabaseError {
  code: string
  message: string
  details?: string
}

// Helper types for database operations
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never

// Type guard for Supabase errors
export function isSupabaseError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  )
}

// Type guard for database query results
export function isQueryResult<T>(
  result: PostgrestResponse<T>
): result is PostgrestResponse<T> & { data: T[] } {
  return result.data !== null
}

// Database schema definition
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          is_admin: boolean
          is_approved: boolean
          is_member: boolean
          email: string | null
          event_reminders_enabled: boolean
          email_notifications: boolean
          in_app_notifications: boolean
          interests: string[] | null
          updated_at: string | null
          leaderboard_opt_out: boolean
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          is_admin?: boolean
          is_approved?: boolean
          is_member?: boolean
          email?: string | null
          event_reminders_enabled?: boolean
          email_notifications?: boolean
          in_app_notifications?: boolean
          interests?: string[] | null
          updated_at?: string | null
          leaderboard_opt_out?: boolean
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          is_admin?: boolean
          is_approved?: boolean
          is_member?: boolean
          email?: string | null
          event_reminders_enabled?: boolean
          email_notifications?: boolean
          in_app_notifications?: boolean
          interests?: string[] | null
          updated_at?: string | null
          leaderboard_opt_out?: boolean
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string
          location: string
          max_guests: number
          created_by: string
          created_at: string
          image_url: string
          is_featured: boolean
          is_published: boolean
          imported_rsvp_count: number | null
          waitlist_enabled: boolean
          waitlist_capacity: number | null
          end_time: string | null
          latitude: number | null
          longitude: number | null
          reminder_enabled: boolean
          reminder_intervals: string[]
          requires_payment: boolean
          ticket_price: number | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time: string
          location: string
          max_guests: number
          created_by: string
          created_at?: string
          image_url: string
          is_featured?: boolean
          is_published?: boolean
          imported_rsvp_count?: number | null
          waitlist_enabled?: boolean
          waitlist_capacity?: number | null
          end_time?: string | null
          latitude?: number | null
          longitude?: number | null
          reminder_enabled?: boolean
          reminder_intervals?: string[]
          requires_payment?: boolean
          ticket_price?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string
          location?: string
          max_guests?: number
          created_by?: string
          created_at?: string
          image_url?: string
          is_featured?: boolean
          is_published?: boolean
          imported_rsvp_count?: number | null
          waitlist_enabled?: boolean
          waitlist_capacity?: number | null
          end_time?: string | null
          latitude?: number | null
          longitude?: number | null
          reminder_enabled?: boolean
          reminder_intervals?: string[]
          requires_payment?: boolean
          ticket_price?: number | null
        }
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          response: string
          status: string
          created_at: string
          send_confirmation_email: boolean
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          response: string
          status?: string
          created_at?: string
          send_confirmation_email?: boolean
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          response?: string
          status?: string
          created_at?: string
          send_confirmation_email?: boolean
        }
      }
      event_guests: {
        Row: {
          id: string
          rsvp_id: string
          first_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          rsvp_id: string
          first_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          rsvp_id?: string
          first_name?: string | null
          created_at?: string
        }
      }
      leaderboard_metrics: {
        Row: {
          id: string
          user_id: string | null
          events_attended: number | null
          events_hosted: number | null
          current_streak: number | null
          longest_streak: number | null
          total_contributions: number | null
          monthly_points: number | null
          weekly_points: number | null
          last_activity_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          events_attended?: number | null
          events_hosted?: number | null
          current_streak?: number | null
          longest_streak?: number | null
          total_contributions?: number | null
          monthly_points?: number | null
          weekly_points?: number | null
          last_activity_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          events_attended?: number | null
          events_hosted?: number | null
          current_streak?: number | null
          longest_streak?: number | null
          total_contributions?: number | null
          monthly_points?: number | null
          weekly_points?: number | null
          last_activity_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      message_status: 'draft' | 'scheduled' | 'sent' | 'failed'
      recipient_type: 'all' | 'list' | 'individual'
      poll_status: 'draft' | 'active' | 'closed'
      poll_visibility: 'public' | 'private'
      notification_type: 'event_reminder' | 'message' | 'poll_share' | 'waitlist'
    }
  }
}

// Type helpers for database operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Utility type for handling database results
export type DatabaseResult<T> = {
  data: T | null
  error: DatabaseError | null
}
