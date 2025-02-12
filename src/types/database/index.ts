
import type { Database } from '../supabase';
import type { TablesRow, TablesInsert, TablesUpdate } from '../database.types';

export * from './base';
export * from './profiles';
export * from './events';
export * from './rsvp';

export type TableRow<T extends keyof Database['public']['Tables']> = TablesRow<T>;
export type InsertRow<T extends keyof Database['public']['Tables']> = TablesInsert<T>;
export type UpdateRow<T extends keyof Database['public']['Tables']> = TablesUpdate<T>;
