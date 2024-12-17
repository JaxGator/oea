import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] ?? ''
    )

    if (authError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the requester is an admin
    const { data: adminProfile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', adminUser.id)
      .single()

    if (!adminProfile?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { username } = await req.json()

    // Get user by username
    const { data: targetProfile, error: getUserError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (getUserError || !targetProfile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_admin: true,
        is_approved: true,
        is_member: true 
      })
      .eq('id', targetProfile.id)

    if (updateError) {
      throw updateError
    }

    // Log the admin action
    await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action_type: 'grant_admin',
        target_type: 'user',
        target_id: targetProfile.id,
        details: { username }
      })

    return new Response(
      JSON.stringify({ message: 'User admin status updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in set-admin-status function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})