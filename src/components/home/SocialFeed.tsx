
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Rss } from "lucide-react";
import { useEffect } from "react";
import type { SocialMediaFeed } from "@/types/database";

export function SocialFeed() {
  const { data: feeds = [], isError } = useQuery({
    queryKey: ['social-feeds'],
    queryFn: async () => {
      console.log('Fetching social feeds...');
      const { data, error } = await supabase
        .from('social_media_feeds' as any)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching social feeds:', error);
        throw error;
      }
      console.log('Fetched social feeds:', data);
      return data as unknown as SocialMediaFeed[];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    const loadFeedScript = () => {
      if (!feeds?.[0]?.feed_url) return;

      // Clean up any existing scripts first
      const existingScripts = document.querySelectorAll('script[data-feed-script]');
      existingScripts.forEach(script => script.remove());

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

  if (isError || !feeds || feeds.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Rss className="h-6 w-6" />
          Social Feed
        </h2>
      </div>
      <div className="w-full h-[480px] relative">
        <div className="absolute inset-0 overflow-y-auto scrollbar-thin hover:scrollbar-thumb-gray-300 rounded-lg border shadow-sm">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: feeds[0].feed_url.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            }} 
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-lg" />
      </div>
    </div>
  );
}
