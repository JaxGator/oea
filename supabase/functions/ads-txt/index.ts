import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface Config {
  key: string;
  value: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the Google Ads ID from site_config
    const { data, error } = await supabaseClient
      .from('site_config')
      .select('value')
      .eq('key', 'google_ads_id')
      .single()

    if (error) throw error
    if (!data?.value) {
      return new Response(
        'No Google Ads ID configured',
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain',
          },
          status: 404 
        }
      )
    }

    // Format the ads.txt content
    const adsContent = `google.com, ${data.value}, DIRECT, f08c47fec0942fa0`

    // Return the ads.txt content with appropriate headers
    return new Response(
      adsContent,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=3600'
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error serving ads.txt:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})