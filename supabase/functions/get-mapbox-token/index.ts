import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('Received request for Mapbox token')
  console.log('Request method:', req.method)
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    console.log('Returning CORS headers:', corsHeaders)
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Attempting to retrieve MAPBOX_PUBLIC_TOKEN')
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    console.log('Token retrieval result:', token ? 'Token exists' : 'Token is missing')
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN not found in environment')
      return new Response(
        JSON.stringify({ 
          error: 'Map configuration not found',
          details: 'MAPBOX_PUBLIC_TOKEN environment variable is not set'
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
        }
      )
    }

    console.log('Successfully retrieved Mapbox token, preparing response')
    const response = new Response(
      JSON.stringify({ token }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
    console.log('Response prepared, sending back to client')
    return response
  } catch (error) {
    console.error('Error in get-mapbox-token function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})