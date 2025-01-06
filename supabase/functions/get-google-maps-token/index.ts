import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const token = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!token) {
      console.error('Google Maps API key not found in environment variables')
      throw new Error('Google Maps API key not configured')
    }

    console.log('Successfully retrieved Google Maps API key')
    
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get-google-maps-token function:', error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: 'Please ensure the GOOGLE_MAPS_API_KEY secret is set in the Supabase dashboard'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500,
      },
    )
  }
})