
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const SUPABASE_URL = "https://qegpuqitjfocyyrivlhv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZ3B1cWl0amZvY3l5cml2bGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzU4NTMsImV4cCI6MjA0OTUxMTg1M30.o3yD902DFG0PlLD0V8pEvx-IbnVawP3HDhNEp6cMoW4";

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY');

// Create a wrapper for console.error that includes timestamps
const logError = (message: string, ...args: any[]) => {
  console.error(`${message} [${new Date().toISOString()}]`, ...args);
};

let supabaseClient;

try {
  // Create the Supabase client with enhanced configuration
  supabaseClient = createClient<Database>(
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
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  );
  
  console.log('Supabase client initialized successfully');
} catch (error) {
  logError('Failed to initialize Supabase client:', error);
  
  // Still provide a fallback client to prevent app from completely crashing
  supabaseClient = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}

// Export the client
export const supabase = supabaseClient;

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
      logError('Supabase auth test error:', {
        error: sessionError,
        errorCode: sessionError.code || 'unknown',
        errorMessage: sessionError.message,
        url: SUPABASE_URL,
      });
      return false;
    }
    
    // Then test a simple database query using maybeSingle() instead of single()
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    if (dbError) {
      logError('Supabase database test error:', {
        error: dbError,
        errorCode: dbError.code,
        errorMessage: dbError.message,
        url: SUPABASE_URL,
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
    logError('Supabase connection test failed:', {
      error,
      url: SUPABASE_URL,
    });
    return false;
  }
};

// Test connection on init
if (typeof window !== 'undefined') {
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      logError('Failed to establish initial Supabase connection');
    }
  });
}
