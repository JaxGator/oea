export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          is_admin: boolean | null;
          is_approved: boolean | null;
          is_member: boolean | null;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          is_admin?: boolean | null;
          is_approved?: boolean | null;
          is_member?: boolean | null;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          is_admin?: boolean | null;
          is_approved?: boolean | null;
          is_member?: boolean | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          time: string;
          location: string;
          max_guests: number;
          created_by: string;
          created_at: string;
          image_url: string;
          imported_rsvp_count?: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          time: string;
          location: string;
          max_guests: number;
          created_by: string;
          created_at?: string;
          image_url: string;
          imported_rsvp_count?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          date?: string;
          time?: string;
          location?: string;
          max_guests?: number;
          created_by?: string;
          created_at?: string;
          image_url?: string;
          imported_rsvp_count?: number | null;
        };
      };
      event_rsvps: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          response: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          user_id?: string;
          response?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          created_at?: string;
          read_at?: string | null;
        };
      };
      site_config: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          updated_by: string | null;
          updated_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string | null;
          updated_by?: string | null;
          updated_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string | null;
          updated_by?: string | null;
          updated_at?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
}