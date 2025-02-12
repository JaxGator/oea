
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

console.log('Loading get-mapbox-token function...')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { ...corsHeaders },
      status: 204
    })
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('Invalid method:', req.method)
    return new Response(
      JSON.stringify({ 
        error: 'Method not allowed',
        success: false 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    )
  }

  try {
    console.log('Fetching Mapbox token...')
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    
    if (!token) {
      console.error('No Mapbox token found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox token not configured',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    console.log('Successfully retrieved Mapbox token')
    return new Response(
      JSON.stringify({
        token,
        success: true,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in get-mapbox-token:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
