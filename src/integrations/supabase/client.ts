import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const SUPABASE_URL = 'https://qegpuqitjfocyyrivlhv.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
    debug: true
  },
  global: {
    headers: {
      'x-application-name': 'lovable'
    }
  }
})

export async function testSupabaseConnection() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test failed:', {
        error,
        message: error.message,
        status: error.status,
        name: error.name,
        details: error,
        url: SUPABASE_URL,
        origin: window.location.origin
      });
      return false;
    }
    
    console.log('Supabase connection test successful:', {
      sessionExists: !!session,
      origin: window.location.origin,
      url: SUPABASE_URL
    });
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', {
      error,
      url: SUPABASE_URL,
      origin: window.location.origin,
      timestamp: new Date().toISOString()
    });
    return false;
  }
}

if (typeof window !== 'undefined') {
  testSupabaseConnection().then(isConnected => {
    if (!isConnected) {
      console.error('Failed to establish initial Supabase connection. Please check:', {
        url: SUPABASE_URL,
        origin: window.location.origin,
        hostname: window.location.hostname
      });
    }
  });
}