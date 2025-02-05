
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './types.ts'

export async function verifyAdminUser(supabaseAdmin: SupabaseClient, authHeader: string | null) {
  if (!authHeader) {
    throw new Error('No authorization header')
  }

  // Verify user is authenticated
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader)
  if (authError || !user) {
    console.error('Auth error:', authError)
    throw new Error('Invalid token')
  }

  // Verify user is admin using service role client
  const { data: adminCheck } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!adminCheck?.is_admin) {
    throw new Error('Unauthorized - Admin access required')
  }

  return user
}
