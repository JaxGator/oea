
import type { Database } from '../database.types';

export * from './base';
export * from './profiles';
export * from './events';
export * from './rsvp';

// Re-export the Database type utility types
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

