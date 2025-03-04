
import { supabase } from "@/integrations/supabase/client";
import type { QueryResult } from "@/types/database.types";
import { isErrorWithMessage, isPostgrestError } from "@/types/supabase";
import { toast } from "sonner";
import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";

export async function executeQuery<T>(
  operation: () => Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>
): Promise<QueryResult<T>> {
  try {
    console.log('Executing database query...');
    const { data, error } = await operation();

    if (error) {
      console.error('Database operation failed:', {
        code: error.code,
        details: error.details,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    // Handle empty data more gracefully
    const result = Array.isArray(data) ? (data.length > 0 ? data[0] : null) : data;

    console.log('Database query completed successfully:', {
      hasData: !!result,
      timestamp: new Date().toISOString()
    });
    return { data: result, error: null };
  } catch (error) {
    const message = isErrorWithMessage(error) 
      ? error.message 
      : 'An unexpected error occurred';
    
    console.error('Database operation error:', {
      error,
      errorMessage: message,
      timestamp: new Date().toISOString()
    });
    
    // Don't show toast for expected "no data" conditions
    if (!message.includes('JSON object requested')) {
      toast.error(message);
    }
    
    return { 
      data: null, 
      error: { 
        message,
        code: isPostgrestError(error) ? error.code : undefined,
        details: isPostgrestError(error) ? error.details : undefined
      } 
    };
  }
}

export async function executeTableQuery<T>(
  table: string,
  query: string,
  params?: Record<string, unknown>[]
): Promise<QueryResult<T>> {
  console.log('Executing table query:', { 
    table, 
    query, 
    params,
    timestamp: new Date().toISOString()
  });

  return executeQuery<T>(async () => {
    const response = await supabase
      .from(table)
      .select(query) as PostgrestResponse<T>;
    
    if (response.error) throw response.error;
    return response;
  });
}

export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  console.error('Unhandled error type:', error);
  return 'An unexpected error occurred';
}
