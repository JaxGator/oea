
import { Json } from './base'

export interface EventsTable {
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
    latitude: number | null
    longitude: number | null
    is_featured: boolean
    is_published: boolean
    imported_rsvp_count: number | null
    waitlist_enabled: boolean
    waitlist_capacity: number | null
    end_time: string | null
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
    latitude?: number | null
    longitude?: number | null
    is_featured?: boolean
    is_published?: boolean
    imported_rsvp_count?: number | null
    waitlist_enabled?: boolean
    waitlist_capacity?: number | null
    end_time?: string | null
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
    latitude?: number | null
    longitude?: number | null
    is_featured?: boolean
    is_published?: boolean
    imported_rsvp_count?: number | null
    waitlist_enabled?: boolean
    waitlist_capacity?: number | null
    end_time?: string | null
    reminder_enabled?: boolean
    reminder_intervals?: string[]
    requires_payment?: boolean
    ticket_price?: number | null
  }
}
