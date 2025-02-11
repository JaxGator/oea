
import { supabase } from "@/integrations/supabase/client";
import type { QueryResult } from "@/types/supabase";
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

    console.log('Database query completed successfully:', {
      hasData: !!data,
      timestamp: new Date().toISOString()
    });
    return { data, error: null };
  } catch (error) {
    const message = isErrorWithMessage(error) ? error.message : 'An unexpected error occurred';
    console.error('Database operation error:', {
      error,
      timestamp: new Date().toISOString()
    });
    toast.error(message);
    return { 
      data: null, 
      error: { 
        message,
        code: isPostgrestError(error) ? error.code : undefined,
        details: isPostgrestError(error) ? error.details : undefined,
        timestamp: new Date().toISOString()
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
  return executeQuery<T>(() => {
    let queryBuilder = supabase.from(table).select(query, { count: 'exact' });
    
    if (params?.length) {
      queryBuilder = params.reduce((builder, param) => {
        const [key, value] = Object.entries(param)[0];
        console.log('Applying filter:', { key, value });
        return builder.eq(key, value);
      }, queryBuilder);
    }
    
    return queryBuilder;
  });
}

export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  console.error('Unhandled error type:', error);
  return 'An unexpected error occurred';
}
