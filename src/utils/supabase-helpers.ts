import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { isSupabaseError } from '@/integrations/supabase/types/helpers';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

export function handleError(error: PostgrestError | null, context?: string) {
  if (error) {
    const errorDetails = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      context,
      timestamp: new Date().toISOString()
    };
    
    console.error('Database error:', errorDetails);
    
    toast({
      title: "Database Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    
    throw error;
  }
}

export function assertData<T>(data: T | null, error: PostgrestError | null, context?: string): asserts data is T {
  handleError(error, context);
  if (!data) {
    const message = 'No data returned from query';
    console.error(message, { context });
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
    throw new Error(message);
  }
}

export async function handleQueryResult<T>(
  response: PostgrestResponse<T> | PostgrestSingleResponse<T>,
  context?: string
): Promise<T> {
  const { data, error } = response;
  handleError(error, context);
  
  if (!data) {
    const message = 'No data returned from query';
    console.error(message, { context });
    throw new Error(message);
  }

  // If we get an array but expect a single item
  if (Array.isArray(data)) {
    if (data.length === 0) {
      const message = 'No data found';
      console.error(message, { context });
      throw new Error(message);
    }
    // Return first item if single result expected
    return data[0] as T;
  }

  return data;
}

export function isQueryError(result: unknown): result is PostgrestError {
  return isSupabaseError(result);
}

export function ensureQueryResult<T>(result: T | PostgrestError, context?: string): T {
  if (isQueryError(result)) {
    handleError(result, context);
    throw result;
  }
  return result;
}

export async function testDatabaseConnection() {
  try {
    const tables = ['profiles', 'events', 'event_rsvps'] as const;
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