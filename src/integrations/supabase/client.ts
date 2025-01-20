import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = 'https://qegpuqitjfocyyrivlhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODg1NzAsImV4cCI6MjAyMTI2NDU3MH0.qDTKLaVpYWS-VXgHmWB_nM1EHAfKE3d8LNnHhAGz5jE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add connection test utility
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('events').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    console.log('Supabase connection test successful');
    return true;
  } catch (err) {
    console.error('Supabase connection test error:', err);
    return false;
  }
};

// Test connection on initialization
testSupabaseConnection();