
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: ProfilesTable
      events: EventsTable
      event_rsvps: EventRSVPsTable
      event_guests: EventGuestsTable
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
