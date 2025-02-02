import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = 'https://qegpuqitjfocyyrivlhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTQxNjAsImV4cCI6MjAyMjQ3MDE2MH0.0REqRkaMJZKxe-9MD_jh0Hy-7Qj1fxW5YvWE5p_5Y8Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
  db: {
    schema: 'public'
  },
  // Configure retry behavior
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});