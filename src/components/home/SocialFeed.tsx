import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Rss } from "lucide-react";
import { useEffect } from "react";

export function SocialFeed() {
  const { data: feeds = [] } = useQuery({
    queryKey: ['social-feeds'],
    queryFn: async () => {
      console.log('Fetching social feeds...');
      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching social feeds:', error);
        throw error;
      }
      console.log('Fetched social feeds:', data);
      return data;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    const loadFeedScript = () => {
      if (!feeds?.[0]?.feed_url) return;

      const scriptMatch = feeds[0].feed_url.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      if (scriptMatch && scriptMatch[1]) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-feed-script', 'true');
        
        const srcMatch = feeds[0].feed_url.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          script.src = srcMatch[1];
        } else {
          script.textContent = scriptMatch[1];
        }
        
        document.body.appendChild(script);
      }
    };

    loadFeedScript();

    return () => {
      const scripts = document.querySelectorAll('script[data-feed-script]');
      scripts.forEach(script => script.remove());
    };
  }, [feeds]);

  if (!feeds || feeds.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Rss className="h-6 w-6" />
          Social Feed
        </h2>
      </div>
      <div className="w-full">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: feeds[0].feed_url.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          }} 
        />
      </div>
    </div>
  );
}