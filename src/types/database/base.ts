
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Import the table types
import { ProfilesTable } from './profiles'
import { EventsTable } from './events'
import { EventRSVPsTable } from './event-rsvps'
import { EventGuestsTable } from './event-guests'

export interface Database {
  public: {
    Tables: {
      profiles: ProfilesTable
      events: EventsTable
      event_rsvps: EventRSVPsTable
      event_guests: EventGuestsTable
      leaderboard_metrics: LeaderboardMetricsTable
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

export interface LeaderboardMetricsTable {
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
