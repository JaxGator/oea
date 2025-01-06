import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { isQueryError } from '@/integrations/supabase/types';

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
  response: PostgrestResponse<T> | PostgrestSingleResponse<T>
): Promise<T> {
  const { data, error } = response;
  
  if (error) {
    console.error('Query error:', error);
    throw error;
  }
  
  if (!data) {
    throw new Error('No data returned from query');
  }

  if (isQueryError(data)) {
    throw new Error('Query returned an error result');
  }

  return data as T;
}

export function ensureQueryResult<T>(result: T | PostgrestError): T {
  if (isQueryError(result)) {
    throw new Error(result.message);
  }
  return result;
}