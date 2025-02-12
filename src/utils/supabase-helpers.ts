
import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { isSupabaseError } from '@/integrations/supabase/types/helpers';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export async function retryWithBackoff<T>(
  operation: () => Promise<PostgrestResponse<T>>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    const response = await operation();
    const { data, error } = response;
    
    if (error) throw error;
    if (!data) throw new Error('No data returned from query');
    
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    if (retries === 0) throw error;
    
    console.log(`Retrying operation, ${retries} attempts remaining. Waiting ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retryWithBackoff(operation, retries - 1, delay * 2);
  }
}

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

export function assertData<T>(
  response: PostgrestResponse<T> | PostgrestSingleResponse<T>, 
  context?: string
): asserts response is PostgrestResponse<T> & { data: T } {
  const { data, error } = response;
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

  // Handle array results when single item is expected
  if (Array.isArray(data)) {
    if (data.length === 0) {
      const message = 'No data found';
      console.error(message, { context });
      throw new Error(message);
    }
    return data[0];
  }

  return data;
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
