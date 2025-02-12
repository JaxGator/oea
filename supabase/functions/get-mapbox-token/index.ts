
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log('Loading get-mapbox-token function...')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    })
  }

  try {
    console.log('Starting Mapbox token fetch process...')
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    
    if (!token) {
      console.error('No Mapbox token found in environment variables')
      throw new Error('Mapbox token not configured')
    }

    console.log('Successfully retrieved Mapbox token')
    
    // Return response with CORS headers
    return new Response(
      JSON.stringify({ 
        token,
        timestamp: new Date().toISOString() 
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in get-mapbox-token:', error.message)
    
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
