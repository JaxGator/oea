import { PostgrestError } from '@supabase/supabase-js';

export function handleSupabaseResponse<T>(
  data: T | null,
  error: PostgrestError | null
): T | null {
  if (error) {
    console.error('Supabase error:', error);
    return null;
  }
  return data;
}