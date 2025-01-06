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

    // Get request body
    const { userId, username, fullName, email, password, isAdmin, isApproved, isMember, avatarUrl } = await req.json()

    // Update auth user if email or password changed
    if (email || password) {
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          email: email,
          password: password,
        }
      )

      if (updateAuthError) {
        console.error('Error updating auth user:', updateAuthError)
        throw updateAuthError
      }
    }

    // Update profile
    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
        is_admin: isAdmin,
        is_approved: isApproved,
        is_member: isMember,
      })
      .eq('id', userId)

    if (updateProfileError) {
      console.error('Error updating profile:', updateProfileError)
      throw updateProfileError
    }

    // Log the admin action
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: user.id,
      action_type: 'update_user',
      target_type: 'user',
      target_id: userId,
      details: {
        username,
        full_name: fullName,
        email: email || undefined,
        password_changed: !!password,
        is_admin: isAdmin,
        is_approved: isApproved,
        is_member: isMember,
      }
    })

    return new Response(
      JSON.stringify({ message: 'User updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-user-management function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})