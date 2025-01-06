import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Loading get-google-maps-token function")

serve(async (req) => {
  // Log request details for debugging
  console.log(`Received ${req.method} request to get-google-maps-token`)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get token from environment
    const token = Deno.env.get('GOOGLE_MAPS_API_KEY')
    console.log('Retrieved Google Maps API key:', token ? 'Found' : 'Not found')
    
    if (!token) {
      console.error('Google Maps API key not found in environment variables')
      throw new Error('Google Maps API key not configured')
    }

    // Return success response with token
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    // Log and return error response
    console.error('Error in get-google-maps-token:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to retrieve Google Maps API key'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})