import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const handleSupabaseError = (error: PostgrestError | null, context?: string) => {
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
};

export const assertData = <T>(data: T | null, error: PostgrestError | null, context?: string): asserts data is T => {
  handleSupabaseError(error, context);
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
};