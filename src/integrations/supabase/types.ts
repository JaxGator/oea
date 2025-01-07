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
      admin_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      event_guests: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          rsvp_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          rsvp_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          rsvp_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_guests_rsvp_id_fkey"
            columns: ["rsvp_id"]
            isOneToOne: false
            referencedRelation: "event_rsvps"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          response: Database["public"]["Enums"]["rsvp_response"]
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          response: Database["public"]["Enums"]["rsvp_response"]
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          response?: Database["public"]["Enums"]["rsvp_response"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          date: string
          description: string | null
          id: string
          image_url: string
          imported_rsvp_count: number | null
          is_featured: boolean | null
          location: string
          max_guests: number
          time: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          id?: string
          image_url: string
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
          location: string
          max_guests: number
          time: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          id?: string
          image_url?: string
          imported_rsvp_count?: number | null
          is_featured?: boolean | null
          location?: string
          max_guests?: number
          time?: string
          title?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_id: string | null
          folder_path: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_id?: string | null
          folder_path: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_id?: string | null
          folder_path?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          created_at: string
          display_order: number
          file_name: string
          id: string
        }
        Insert: {
          created_at?: string
          display_order: number
          file_name: string
          id?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_name?: string
          id?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string
          created_at: string | null
          id: string
          page_id: string
          section_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          page_id: string
          section_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          page_id?: string
          section_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email_notifications: boolean | null
          full_name: string | null
          id: string
          in_app_notifications: boolean | null
          is_admin: boolean | null
          is_approved: boolean | null
          is_member: boolean | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          in_app_notifications?: boolean | null
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_member?: boolean | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          in_app_notifications?: boolean | null
          is_admin?: boolean | null
          is_approved?: boolean | null
          is_member?: boolean | null
          username?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: string | null
          verification_status: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
          verification_status?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: string | null
          verification_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "site_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string | null
          blocker_id: string | null
          created_at: string
          id: string
        }
        Insert: {
          blocked_id?: string | null
          blocker_id?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string | null
          blocker_id?: string | null
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_update_user: {
        Args: {
          admin_id: string
          target_user_id: string
          new_username: string
          new_full_name: string
          new_avatar_url: string
          new_is_admin: boolean
          new_is_approved: boolean
          new_is_member: boolean
        }
        Returns: undefined
      }
      can_message_user: {
        Args: {
          target_user_id: string
        }
        Returns: boolean
      }
      create_profile: {
        Args: {
          user_id: string
          user_username: string
          user_full_name?: string
          user_avatar_url?: string
          user_is_admin?: boolean
        }
        Returns: undefined
      }
      import_wix_event:
        | {
            Args: {
              p_title: string
              p_description: string
              p_date: string
              p_time: string
              p_location: string
              p_max_guests: number
              p_created_by: string
              p_image_url: string
              p_created_at?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_title: string
              p_description: string
              p_date: string
              p_time: string
              p_location: string
              p_max_guests: number
              p_created_by: string
              p_image_url: string
              p_rsvp_count?: number
              p_created_at?: string
            }
            Returns: string
          }
      search_site: {
        Args: {
          search_term: string
        }
        Returns: {
          type: string
          id: string
          title: string
          description: string
          url: string
          created_at: string
        }[]
      }
    }
    Enums: {
      rsvp_response: "attending" | "not_attending" | "maybe"
      social_media_platform: "instagram" | "facebook" | "twitter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
