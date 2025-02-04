
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateUserRequest {
  action?: string;
  userId: string;
  username?: string;
  fullName?: string;
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
  avatarUrl?: string;
  email?: string;
  password?: string;
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

    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    const requestData: UpdateUserRequest = await req.json()
    const { action, userId, username, fullName, isAdmin, isApproved, isMember, avatarUrl, email, password } = requestData

    // Handle get_user action
    if (action === 'get_user') {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (userError) {
        console.error('Error fetching user:', userError)
        return new Response(
          JSON.stringify({ error: userError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ email: userData.user.email }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle update action (default)
    console.log('Updating user:', { 
      userId, 
      username, 
      fullName, 
      isAdmin, 
      isApproved, 
      isMember, 
      avatarUrl, 
      hasEmail: !!email, 
      hasPassword: !!password 
    })

    // Update auth email/password if provided
    if (email || password) {
      const authUpdate: any = {}
      if (email) authUpdate.email = email
      if (password) authUpdate.password = password

      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        authUpdate
      )

      if (authUpdateError) {
        console.error('Error updating auth user:', authUpdateError)
        return new Response(
          JSON.stringify({ error: authUpdateError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update profile data
    const updates: any = {}
    if (username) updates.username = username
    if (fullName !== undefined) updates.full_name = fullName
    if (isAdmin !== undefined) updates.is_admin = isAdmin
    if (isApproved !== undefined) updates.is_approved = isApproved
    if (isMember !== undefined) updates.is_member = isMember
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl
    if (email !== undefined) updates.email = email

    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (updateProfileError) {
      console.error('Error updating profile:', updateProfileError)
      return new Response(
        JSON.stringify({ error: updateProfileError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the admin action
    const { error: logError } = await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action_type: 'update_user',
        target_type: 'user',
        target_id: userId,
        details: updates
      })

    if (logError) {
      console.error('Error creating admin log:', logError)
    }

    return new Response(
      JSON.stringify({ message: 'User updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-user-management function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
