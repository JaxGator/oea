import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log('Loading get-google-maps-token function...')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    console.log('Starting Google Maps token fetch...')
    const token = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!token) {
      console.error('No Google Maps API key found in environment variables')
      throw new Error('Google Maps API key not configured')
    }

    console.log('Token retrieved successfully')
    
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in get-google-maps-token:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
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