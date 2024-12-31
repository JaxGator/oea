import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('Generating sitemap...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Fetch dynamic routes from events table
    const { data: events, error: eventsError } = await supabaseClient
      .from('events')
      .select('id')
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    // Static routes with their specific configurations
    const staticRoutes = [
      {
        path: '/',
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        path: '/events',
        changefreq: 'weekly',
        priority: '0.9'
      },
      {
        path: '/about',
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        path: '/resources',
        changefreq: 'weekly',
        priority: '0.8'
      }
    ];

    // Add dynamic event routes
    const eventRoutes = events.map(event => ({
      path: `/events/${event.id}`,
      changefreq: 'weekly',
      priority: '0.7'
    }));

    const allRoutes = [...staticRoutes, ...eventRoutes];

    // Get the base URL from the request or environment
    const baseUrl = 'https://www.outdoorenergyadventures.com';
    console.log('Base URL:', baseUrl);

    // Generate the sitemap XML with proper XML namespace and formatting
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`;

    console.log('Generated sitemap XML');

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: 'Error generating sitemap' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})