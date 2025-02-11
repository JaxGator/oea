
export * from './base'
export * from './profiles'
export * from './events'
export * from './rsvp'

export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
