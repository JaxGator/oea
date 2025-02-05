
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export function createSupabaseAdmin() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.replace(/\/$/, '') // Remove trailing slash
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing required environment variables:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceRoleKey
    });
    throw new Error('Server configuration error')
  }

  console.log('Creating Supabase admin client with URL:', {
    url: supabaseUrl,
    hasServiceKey: !!supabaseServiceRoleKey
  });

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
