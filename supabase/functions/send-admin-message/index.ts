
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    console.log('Initializing send-admin-message function')
    
    const supabaseAdmin = createClient(
      supabaseUrl!,
      supabaseServiceRole!
    )

    const { message } = await req.json()
    console.log('Received message request:', { messageLength: message?.length })

    if (!message) {
      console.error('Validation failed: Message is required')
      throw new Error('Message is required')
    }

    // Get all admin users
    console.log('Fetching admin profiles')
    const { data: adminProfiles, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('is_admin', true)

    if (adminError) {
      console.error('Error fetching admin profiles:', adminError)
      throw adminError
    }

    if (!adminProfiles?.length) {
      console.error('No administrators found')
      throw new Error('No administrators found')
    }

    console.log(`Found ${adminProfiles.length} admin(s), creating messages`)

    // Create messages for each admin
    const messagePromises = adminProfiles.map(admin => 
      supabaseAdmin
        .from('messages')
        .insert({
          sender_id: null,
          receiver_id: admin.id,
          content: message,
          type: 'system'
        })
    )

    const results = await Promise.all(messagePromises)
    const errors = results.filter(r => r.error)
    
    if (errors.length > 0) {
      console.error('Errors creating messages:', errors)
      throw new Error('Failed to send message to some administrators')
    }

    console.log('Successfully sent messages to all administrators')
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in send-admin-message:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false
      }), 
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
