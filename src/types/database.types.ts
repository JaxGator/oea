export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          is_admin: boolean | null
          is_approved: boolean | null
          is_member: boolean | null
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_member?: boolean | null
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_member?: boolean | null
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
        }
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          response: 'attending' | 'not_attending' | 'maybe'
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          response: 'attending' | 'not_attending' | 'maybe'
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          response?: 'attending' | 'not_attending' | 'maybe'
          created_at?: string
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
      page_content: {
        Row: {
          id: string
          page_id: string
          section_id: string
          content: string
          updated_by: string | null
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          page_id: string
          section_id: string
          content: string
          updated_by?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          page_id?: string
          section_id?: string
          content?: string
          updated_by?: string | null
          updated_at?: string | null
          created_at?: string | null
        }
      }
    }
    Enums: {
      rsvp_response: 'attending' | 'not_attending' | 'maybe'
    }
  }
}