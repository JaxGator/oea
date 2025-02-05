
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../admin-user-management/types.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
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

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader)
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify admin status
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

    // Get the user ID from request body
    const { userId } = await req.json()
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Starting deletion process for user:', userId);

    // Begin deletion process - using transactions
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      throw deleteError
    }

    // Log the successful deletion
    console.log('Successfully deleted user:', userId);

    // Log the admin action
    const { error: logError } = await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: user.id,
        action_type: 'delete_user',
        target_type: 'user',
        target_id: userId,
        details: { deleted_user_id: userId }
      })

    if (logError) {
      console.error('Error creating admin log:', logError)
      // Don't throw here as the main operation was successful
    }

    return new Response(
      JSON.stringify({ 
        message: 'User deleted successfully',
        userId: userId 
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
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete user',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
