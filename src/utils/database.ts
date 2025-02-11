
import { supabase } from "@/integrations/supabase/client";
import type { QueryResult } from "@/types/supabase";
import { isErrorWithMessage } from "@/types/supabase";
import { toast } from "sonner";

export async function executeQuery<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<QueryResult<T>> {
  try {
    const { data, error } = await operation();

    if (error) {
      console.error('Database operation failed:', error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    const message = isErrorWithMessage(error) ? error.message : 'An unexpected error occurred';
    console.error('Database operation error:', error);
    toast.error(message);
    return { data: null, error: { message } };
  }
}

export async function executeTableQuery<T>(
  table: string,
  query: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return executeQuery<T>(() =>
    supabase.from(table).select(query, { count: 'exact' })
  );
}

export function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
