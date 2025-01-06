import { Database } from './database';
import { Json } from './tables';
import { Message } from './messages';
import { PostgrestError } from '@supabase/supabase-js';

// Re-export types
export type { Database, Json, Message };

// Helper type for handling Supabase query results
export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

// Type guard for checking if a result is a Supabase error
export function isSupabaseError(result: unknown): result is PostgrestError {
  return result !== null && typeof result === 'object' && 'code' in result && 'message' in result;
}

// Type guard for checking if a result has a specific property
export function hasProperty<K extends string>(obj: unknown, prop: K): obj is { [key in K]: unknown } {
  return obj !== null && typeof obj === 'object' && prop in obj;
}

// Helper function to safely access properties from query results
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  if (!obj || isSupabaseError(obj)) return undefined;
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

// Helper function to assert data exists
export function assertData<T>(data: T | null | undefined): asserts data is T {
  if (!data) {
    throw new Error('Data is null or undefined');
  }
}

// Helper type for query responses
export type QueryResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

// Helper type for database schema
export type SchemaName = keyof Database;

// Helper type for table definitions
export type TableDefinitions = Database['public']['Tables'];

// Helper type for table names
export type TableNames = keyof TableDefinitions;