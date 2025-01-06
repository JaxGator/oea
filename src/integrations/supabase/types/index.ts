import { Database } from './database';
import { Json } from './tables';
import { Message } from './messages';

// Re-export types
export type { Database, Json, Message };

// Helper type for handling Supabase query results
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

// Type guard for checking if a result is an error
export function isQueryError(result: any): result is { error: true } & String {
  return result && typeof result === 'object' && 'error' in result;
}

// Type guard for checking if a result has a specific property
export function hasProperty<K extends string>(obj: unknown, prop: K): obj is { [key in K]: unknown } {
  return obj !== null && typeof obj === 'object' && prop in obj;
}

// Helper function to safely access properties from query results
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  if (!obj || isQueryError(obj)) return undefined;
  return obj[key];
}

// Helper type for table rows
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Helper type for table inserts
export type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

// Helper type for table updates
export type TableUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Helper function to handle query results with type safety
export function handleQueryResult<T>(result: { data: T | null; error: any } | null): T | null {
  if (!result || result.error || !result.data) return null;
  return result.data;
}