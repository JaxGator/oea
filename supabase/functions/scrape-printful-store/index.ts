import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const STORE_URL = 'https://outdoorenergyadventures.printful.me/';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting Printful store scraping...');
    
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlKey) {
      throw new Error('Firecrawl API key not found')
    }

    console.log('Fetching HTML content using Firecrawl...');
    
    // Fetch HTML content using Firecrawl
    const response = await fetch('https://api.firecrawl.io/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: STORE_URL,
        selectors: {
          products: {
            selector: '.product-item',
            multiple: true,
            data: {
              title: '.product-title',
              price: '.product-price',
              image: {
                selector: '.product-image img',
                attr: 'src'
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error:', errorText);
      throw new Error(`Firecrawl API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Firecrawl response:', data);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'public' } }
    );

    // Store scraped products in the database
    const { data: products, error } = await supabaseClient
      .from('scraped_products')
      .upsert(
        data.products.map((product: any) => ({
          title: product.title,
          price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
          image_url: product.image
        }))
      );

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully stored products in database');

    return new Response(
      JSON.stringify({ products }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in scrape-printful-store function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})