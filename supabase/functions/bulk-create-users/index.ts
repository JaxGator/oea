import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify admin status
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

    const { users } = await req.json()

    const results = []
    const errors = []

    for (const userData of users) {
      try {
        // Generate a random password
        const password = Math.random().toString(36).slice(-8)
        
        // Create the user in Auth
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: `${userData.firstName} ${userData.lastName}`,
          }
        })

        if (createError) {
          console.error('Error creating user:', createError)
          errors.push({ email: userData.email, error: createError.message })
          continue
        }

        // Update the profile with approved status
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .update({
            full_name: `${userData.firstName} ${userData.lastName}`,
            is_approved: true,
            username: userData.email.split('@')[0]
          })
          .eq('id', newUser.user.id)

        if (profileError) {
          console.error('Error updating profile:', profileError)
          errors.push({ email: userData.email, error: profileError.message })
          continue
        }

        results.push({
          email: userData.email,
          password,
          userId: newUser.user.id
        })

      } catch (error) {
        console.error('Error processing user:', userData.email, error)
        errors.push({ email: userData.email, error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Bulk user creation completed',
        results,
        errors
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in bulk-create-users function:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})