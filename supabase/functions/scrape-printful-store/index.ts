import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const STORE_URL = 'https://outdoorenergyadventures.printful.me/';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlKey) {
      throw new Error('Firecrawl API key not found')
    }

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

    const data = await response.json();

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

    if (error) throw error;

    return new Response(
      JSON.stringify({ products }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})