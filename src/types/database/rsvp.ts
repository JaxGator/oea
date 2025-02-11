
import { Json } from './base'

export interface EventRSVPsTable {
  Row: {
    id: string
    event_id: string
    user_id: string
    response: 'attending' | 'not_attending' | 'maybe'
    status: 'confirmed' | 'waitlisted'
    created_at: string
    send_confirmation_email: boolean
  }
  Insert: {
    id?: string
    event_id: string
    user_id: string
    response: 'attending' | 'not_attending' | 'maybe'
    status?: 'confirmed' | 'waitlisted'
    created_at?: string
    send_confirmation_email?: boolean
  }
  Update: {
    id?: string
    event_id?: string
    user_id?: string
    response?: 'attending' | 'not_attending' | 'maybe'
    status?: 'confirmed' | 'waitlisted'
    created_at?: string
    send_confirmation_email?: boolean
  }
}

export interface EventGuestsTable {
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
