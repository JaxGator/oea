
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
    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing required environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceRoleKey
      });
      throw new Error('Server configuration error')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Validate auth token
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is admin
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
      console.log('Fetching user data for:', userId)
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

    // Update auth user if email or password provided
    if (email || password) {
      try {
        const authUpdate: { email?: string; password?: string } = {}
        if (email) {
          if (!email.includes('@')) {
            throw new Error('Invalid email format')
          }
          authUpdate.email = email
        }
        if (password) {
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters')
          }
          authUpdate.password = password
        }

        console.log('Attempting auth update with:', {
          userId,
          hasEmail: !!email,
          hasPassword: !!password
        })

        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          authUpdate
        )

        if (authUpdateError) {
          console.error('Error updating auth user:', authUpdateError)
          throw authUpdateError
        }
      } catch (error) {
        console.error('Error in auth update:', error)
        return new Response(
          JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to update authentication details' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update profile data
    try {
      const updates: any = {}
      if (username !== undefined) updates.username = username
      if (fullName !== undefined) updates.full_name = fullName
      if (isAdmin !== undefined) updates.is_admin = isAdmin
      if (isApproved !== undefined) updates.is_approved = isApproved
      if (isMember !== undefined) updates.is_member = isMember
      if (avatarUrl !== undefined) updates.avatar_url = avatarUrl
      
      // Only update email in profiles if auth update was successful
      if (email !== undefined) updates.email = email

      console.log('Attempting profile update with:', updates)

      const { error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      if (updateProfileError) {
        console.error('Error updating profile:', updateProfileError)
        throw updateProfileError
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
      console.error('Error in profile update:', error)
      return new Response(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Failed to update user profile'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in admin-user-management function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
