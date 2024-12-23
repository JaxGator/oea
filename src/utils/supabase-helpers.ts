import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export function handleError(error: PostgrestError | null) {
  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message);
  }
}

export function assertData<T>(data: T | null, error: PostgrestError | null): asserts data is T {
  handleError(error);
  if (!data) {
    throw new Error('No data returned from query');
  }
}

export async function handleQueryResult<T>(
  promise: Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<T> {
  const { data, error } = await promise;
  handleError(error);
  if (!data) {
    throw new Error('No data returned from query');
  }
  return data;
}