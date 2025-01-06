import { PostgrestError } from '@supabase/supabase-js';

// Type guard for checking if a result is a Supabase error
export function isSupabaseError(result: unknown): result is PostgrestError {
  return result !== null && 
         typeof result === 'object' && 
         'code' in result && 
         'message' in result;
}

// Helper function to safely handle query results
export function handleQueryResult<T>(result: { data: T | null; error: PostgrestError | null }): T | null {
  if (!result || result.error || !result.data) return null;
  return result.data;
}

// Helper function to assert data exists
export function assertData<T>(data: T | null | undefined): asserts data is T {
  if (!data) {
    throw new Error('Data is null or undefined');
  }
}