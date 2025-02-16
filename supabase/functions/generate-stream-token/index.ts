
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { StreamChat } from 'https://esm.sh/stream-chat@8.14.5'

const streamChat = new StreamChat(
  Deno.env.get('STREAM_API_KEY') || '',
  Deno.env.get('STREAM_API_SECRET') || ''
);

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401 }
      )
    }

    // Verify the user's JWT
    const { data: { user }, error } = await supabaseClient.auth.getUser(authHeader)
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401 }
      )
    }

    // Get request body
    const { userId } = await req.json()
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { status: 403 }
      )
    }

    // Generate Stream Chat token
    const token = streamChat.createToken(userId)

    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 200 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      },
    )
  }
})
