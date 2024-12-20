import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

// Supabase configuration
const supabaseUrl = 'https://qegpuqitjfocyyrivlhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTg1NzgsImV4cCI6MjAyMzA3NDU3OH0.qDPDUPKqjqDQPwHmA6RQvRTzjY7QWrEBUAPKBDZUXAY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Cache-Control': 'no-store',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
  },
});

// Error logging
supabase.from('events').select('*')
  .then(response => {
    if (response.error) {
      console.error('Supabase error:', response.error);
    }
  });