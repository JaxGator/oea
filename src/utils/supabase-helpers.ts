import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { isSupabaseError } from '@/integrations/supabase/types/helpers';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export function handleError(error: PostgrestError | null) {
  if (error) {
    console.error('Database error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: "Database Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    
    throw error;
  }
}

export function assertData<T>(data: T | null, error: PostgrestError | null): asserts data is T {
  handleError(error);
  if (!data) {
    const message = 'No data returned from query';
    console.error(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    throw new Error(message);
  }
}

export async function handleQueryResult<T>(
  response: PostgrestResponse<T> | PostgrestSingleResponse<T>
): Promise<T> {
  const { data, error } = response;
  handleError(error);
  if (!data) {
    throw new Error('No data returned from query');
  }
  return data;
}

export function isQueryError(result: unknown): result is PostgrestError {
  return isSupabaseError(result);
}

export function ensureQueryResult<T>(result: T | PostgrestError): T {
  if (isQueryError(result)) {
    handleError(result);
    throw result;
  }
  return result;
}

// Test database connection and table access
export async function testDatabaseConnection() {
  try {
    const tables = ['profiles', 'events', 'event_rsvps'];
    const results = await Promise.all(
      tables.map(async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
          
        return {
          table,
          success: !error,
          error: error?.message
        };
      })
    );
    
    console.log('Database connection test results:', results);
    return results.every(r => r.success);
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}