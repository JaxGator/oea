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

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if requesting user is admin
    const { data: adminCheck } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminCheck?.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all members who are not admins
    const { data: members, error: membersError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('is_member', true)
      .eq('is_admin', false)

    if (membersError) {
      throw membersError
    }

    const updatePromises = members.map(async (member) => {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        member.id,
        { password: 'oea-password' }
      )
      
      if (updateError) {
        console.error(`Error updating user ${member.id}:`, updateError)
        return { id: member.id, success: false, error: updateError.message }
      }
      
      return { id: member.id, success: true }
    })

    const results = await Promise.all(updatePromises)

    // Log the admin action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: user.id,
      action_type: 'bulk_password_update',
      target_type: 'users',
      target_id: user.id,
      details: { affected_users: results }
    })

    return new Response(
      JSON.stringify({ 
        message: 'Passwords updated successfully',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in bulk-password-update function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})