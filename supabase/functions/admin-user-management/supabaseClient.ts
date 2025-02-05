
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export function createSupabaseAdmin() {
  // Get and validate environment variables
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing required environment variables:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceRoleKey
    })
    throw new Error('Server configuration error')
  }

  // Remove trailing slash if present
  const cleanUrl = supabaseUrl.replace(/\/$/, '')
  
  console.log('Creating Supabase admin client with URL:', {
    url: cleanUrl,
    hasServiceKey: !!supabaseServiceRoleKey
  })

  return createClient(
    cleanUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
