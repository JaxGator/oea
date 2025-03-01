
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { message } = await req.json()

    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the user who sent the message
    const { data: { user } } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '') || ''
    )

    console.log('User info:', user)

    // Get the user's profile
    let senderInfo = 'Anonymous user'
    if (user?.id) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('Profile info:', profile)

      if (profile) {
        senderInfo = profile.full_name || profile.username || user.email || 'Unknown user'
      }
    }

    // Save to admin_notifications table
    const { error: adminNotificationError } = await supabaseClient
      .from('admin_notifications')
      .insert({
        type: 'contact',
        message: `Message from ${senderInfo}`,
        metadata: {
          message,
          sender: senderInfo,
          sender_id: user?.id,
          timestamp: new Date().toISOString(),
          user_details: user ? {
            id: user.id,
            email: user.email,
          } : null
        }
      })

    if (adminNotificationError) {
      console.error('Error creating admin notification:', adminNotificationError)
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send message to administrator' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Also insert into auth_notifications for better display
    const { error: authNotificationError } = await supabaseClient
      .from('auth_notifications')
      .insert({
        type: 'contact',
        message: `Message from ${senderInfo}`,
        metadata: message, // Store the full message text here
        is_read: false
      })

    if (authNotificationError) {
      console.error('Error creating auth notification:', authNotificationError)
      // Don't fail on this error, just log it
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
