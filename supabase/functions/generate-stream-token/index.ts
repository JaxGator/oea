
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { StreamChat } from 'https://esm.sh/stream-chat@8.14.5'

console.log('Starting generate-stream-token function');

const streamChat = new StreamChat(
  Deno.env.get('STREAM_API_KEY') || '',
  Deno.env.get('STREAM_API_SECRET') || ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    console.log('Received request:', req.method);
    
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Log environment variables (without exposing sensitive data)
    console.log('Environment check:', {
      hasStreamApiKey: !!Deno.env.get('STREAM_API_KEY'),
      hasStreamApiSecret: !!Deno.env.get('STREAM_API_SECRET'),
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasSupabaseServiceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) {
      console.error('No authorization header found');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      )
    }

    // Verify the user's JWT
    console.log('Verifying user JWT');
    const { data: { user }, error } = await supabaseClient.auth.getUser(authHeader)
    if (error) {
      console.error('JWT verification error:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      )
    }
    if (!user) {
      console.error('No user found for JWT');
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401 
        }
      )
    }

    // Get request body
    console.log('Parsing request body');
    const { userId } = await req.json()
    if (userId !== user.id) {
      console.error('User ID mismatch:', { providedId: userId, tokenUserId: user.id });
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403 
        }
      )
    }

    // Generate Stream Chat token
    console.log('Generating Stream Chat token for user:', userId);
    const token = streamChat.createToken(userId)

    console.log('Successfully generated token');
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Function error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        name: error.name,
        stack: error.stack 
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500
      },
    )
  }
})
