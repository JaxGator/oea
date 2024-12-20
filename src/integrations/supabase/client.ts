import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://qegpuqitjfocyyrivlhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NjI5ODgsImV4cCI6MjAyNDUzODk4OH0.qDTKGVv4VYGw_RQ8jI_92uVJhDQXEPqGLKBJzkJhQXA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Add a test function to verify connection
export const testSupabaseConnection = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
    
    console.log('Supabase connection test successful:', session);
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};