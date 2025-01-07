import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qegpuqitjfocyyrivlhv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzU4NTMsImV4cCI6MjA0OTUxMTg1M30.o3yD902DFG0PlLD0V8pEvx-IbnVawP3HDhNEp6cMoW4";

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
    },
  },
  db: {
    schema: 'public'
  },
});

// Test connection and log detailed errors
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        details: error
      });
      return false;
    }
    
    console.log('Supabase connection test successful:', {
      hasSession: !!session,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', {
      error,
      url: SUPABASE_URL,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};

// Call test connection on init and log the result
if (typeof window !== 'undefined') {
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      console.error('Failed to establish initial Supabase connection');
    }
  });
}