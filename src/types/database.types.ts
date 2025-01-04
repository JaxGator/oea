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
          is_admin: boolean
          is_approved: boolean
          is_member: boolean
          email_notifications: boolean
          in_app_notifications: boolean
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
          email_notifications?: boolean
          in_app_notifications?: boolean
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
          email_notifications?: boolean
          in_app_notifications?: boolean
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
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
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
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
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
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
        }
      }
      event_rsvps: {
        Row: {
          id: string
          event_id: string
          user_id: string
          response: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          response: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          response?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
      }
      site_config: {
        Row: {
          id: string
          key: string
          value: string | null
          updated_by: string | null
          updated_at: string | null
          created_at: string | null
          verification_status: boolean | null
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          updated_by?: string | null
          updated_at?: string | null
          created_at?: string | null
          verification_status?: boolean | null
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          updated_by?: string | null
          updated_at?: string | null
          created_at?: string | null
          verification_status?: boolean | null
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
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never