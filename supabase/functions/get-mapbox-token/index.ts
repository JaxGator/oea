
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log('Loading get-mapbox-token function...')

serve(async (req) => {
  // This is necessary for CORS to work
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
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
    console.error('Error in get-mapbox-token:', error.message)
    
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
