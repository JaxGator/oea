
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    const supabaseAdmin = createClient(
      supabaseUrl!,
      supabaseServiceRole!
    )

    const { message } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Get all admin users
    const { data: adminProfiles, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('is_admin', true)

    if (adminError) throw adminError

    if (!adminProfiles?.length) {
      throw new Error('No administrators found')
    }

    // Create messages for each admin
    const messagePromises = adminProfiles.map(admin => 
      supabaseAdmin
        .from('messages')
        .insert({
          sender_id: null, // System message
          receiver_id: admin.id,
          content: message,
          type: 'system'
        })
    )

    await Promise.all(messagePromises)

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
      JSON.stringify({ error: error.message }), 
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
