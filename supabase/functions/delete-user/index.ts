
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Delete user function started');
    
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth header
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    console.log('Auth header present:', !!authHeader);

    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the request is from an admin
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader)
    if (authError || !user) {
      console.error('Auth error:', authError)
      throw new Error('Invalid token')
    }

    console.log('Authenticated as user:', user.id);

    // Verify admin status
    const { data: adminCheck, error: adminCheckError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (adminCheckError) {
      console.error('Admin check error:', adminCheckError);
      throw new Error('Failed to verify admin status');
    }

    if (!adminCheck?.is_admin) {
      throw new Error('Unauthorized - Admin access required')
    }

    console.log('Admin status verified');

    // Get and validate userId from request body
    const { userId } = await req.json()
    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Starting deletion process for user:', userId);

    // Delete auth user - this will trigger cascading deletes in the database
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      throw deleteError
    }

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
        error: error instanceof Error ? error.message : 'Failed to delete user',
        details: error
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
