import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STORE_URL = 'https://outdoorenergyadventures.printful.me/';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting Printful store scraping...');
    
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlKey) {
      throw new Error('Firecrawl API key not found')
    }

    // First try a simple request to verify API connectivity
    const testResponse = await fetch('https://api.firecrawl.io/health', {
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`
      }
    });

    if (!testResponse.ok) {
      console.error('Firecrawl API health check failed:', await testResponse.text());
      throw new Error('Failed to connect to Firecrawl API');
    }

    console.log('Firecrawl API health check successful, proceeding with scrape request...');

    // Main scraping request with simplified selectors
    const response = await fetch('https://api.firecrawl.io/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: STORE_URL,
        waitUntil: 'networkidle0',
        timeout: 60000,
        selectors: {
          products: {
            selector: '.product-grid .product-item',
            multiple: true,
            data: {
              title: '.product-title',
              price: '.product-price',
              image: {
                selector: 'img',
                attr: 'src'
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw Firecrawl response:', JSON.stringify(data, null, 2));

    if (!data.products || !Array.isArray(data.products)) {
      console.error('Invalid data structure received:', data);
      throw new Error('Invalid data structure received from Firecrawl');
    }

    // Process and clean the data
    const processedProducts = data.products.map((product: any) => ({
      title: String(product.title).trim(),
      price: typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
        : 0,
      image_url: String(product.image || '').trim()
    })).filter(p => p.title && p.image_url && p.price > 0);

    console.log('Processed products:', JSON.stringify(processedProducts, null, 2));

    // Store in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabaseClient
      .from('scraped_products')
      .upsert(processedProducts);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Successfully stored products in database');

    return new Response(
      JSON.stringify({ products: processedProducts }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in scrape-printful-store function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})