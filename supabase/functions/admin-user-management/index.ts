import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateUserRequest {
  userId: string;
  email?: string;
  password?: string;
  username?: string;
  fullName?: string;
  isAdmin?: boolean;
  isApproved?: boolean;
  isMember?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the request is from an admin
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify admin status
    const { data: adminCheck } = await supabase
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

    // Get request data
    const { userId, email, password, username, fullName, isAdmin, isApproved, isMember }: UpdateUserRequest = await req.json()

    // Update auth user if email or password is provided
    if (email || password) {
      const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
        userId,
        { email, password }
      )

      if (updateAuthError) {
        return new Response(
          JSON.stringify({ error: updateAuthError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update profile if any profile fields are provided
    if (username || fullName !== undefined || isAdmin !== undefined || isApproved !== undefined || isMember !== undefined) {
      const updates: any = {}
      if (username) updates.username = username
      if (fullName !== undefined) updates.full_name = fullName
      if (isAdmin !== undefined) updates.is_admin = isAdmin
      if (isApproved !== undefined) updates.is_approved = isApproved
      if (isMember !== undefined) updates.is_member = isMember

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      if (updateProfileError) {
        return new Response(
          JSON.stringify({ error: updateProfileError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ message: 'User updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})