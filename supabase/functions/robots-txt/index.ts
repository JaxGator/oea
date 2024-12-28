import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const robotsTxtContent = `User-agent: *
Allow: /
Allow: /events
Allow: /about
Allow: /resources
Allow: /members

User-agent: Mediapartners-Google
Allow: /

User-agent: Adsbot-Google
Allow: /

Sitemap: ${Deno.env.get('SITE_URL')}/sitemap.xml
`

serve(async (req) => {
  return new Response(robotsTxtContent, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  })
})