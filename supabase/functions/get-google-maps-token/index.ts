import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting Google Maps token fetch...')
    
    const token = Deno.env.get('GOOGLE_MAPS_API_KEY')
    console.log('Token retrieved:', token ? 'Found' : 'Not found')
    
    if (!token) {
      console.error('Google Maps API key not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Google Maps API key not configured',
          details: 'Missing environment variable GOOGLE_MAPS_API_KEY'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Successfully retrieved Google Maps API key')
    
    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-google-maps-token function:', error.message)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})