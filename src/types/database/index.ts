
import type { Database } from '../database.types';
import type { Tables, TablesInsert, TablesUpdate } from '../database.types';

export * from './base';
export * from './profiles';
export * from './events';
export * from './rsvp';

export type TableRow<T extends keyof Database['public']['Tables']> = Tables<T>;
export type InsertRow<T extends keyof Database['public']['Tables']> = TablesInsert<T>;
export type UpdateRow<T extends keyof Database['public']['Tables']> = TablesUpdate<T>;
