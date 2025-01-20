import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';
import { toast } from 'sonner';

const supabaseUrl = 'https://qegpuqitjfocyyrivlhv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2ODg1NzAsImV4cCI6MjAyMTI2NDU3MH0.qDTKLaVpYWS-VXgHmWB_nM1EHAfKE3d8LNnHhAGz5jE';

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  }
});

// Test connection and log detailed errors
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
    
    console.log('Supabase connection test successful:', {
      hasSession: !!session,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};

// Call test connection on init
if (typeof window !== 'undefined') {
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      console.error('Failed to establish initial Supabase connection');
      toast.error("Connection error. Please refresh the page.");
    }
  });
}