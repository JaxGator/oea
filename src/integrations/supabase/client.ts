
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const SUPABASE_URL = "https://qegpuqitjfocyyrivlhv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzU4NTMsImV4cCI6MjA0OTUxMTg1M30.o3yD902DFG0PlLD0V8pEvx-IbnVawP3HDhNEp6cMoW4";

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'oea-auth-token',
      debug: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'supabase-js-web',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Enhanced connection test with detailed logging
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...', {
      url: SUPABASE_URL,
      timestamp: new Date().toISOString()
    });
    
    // First test auth session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Supabase auth test error:', {
        error: sessionError,
        errorCode: sessionError.code || 'unknown',
        errorMessage: sessionError.message,
        url: SUPABASE_URL,
        timestamp: new Date().toISOString()
      });
      return false;
    }
    
    // Then test a simple database query
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();
    
    if (dbError) {
      console.error('Supabase database test error:', {
        error: dbError,
        errorCode: dbError.code,
        errorMessage: dbError.message,
        url: SUPABASE_URL,
        timestamp: new Date().toISOString()
      });
      return false;
    }
    
    console.log('Supabase connection test successful:', {
      hasSession: !!session,
      url: SUPABASE_URL,
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

// Test connection on init
if (typeof window !== 'undefined') {
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      console.error('Failed to establish initial Supabase connection');
    }
  });
}
