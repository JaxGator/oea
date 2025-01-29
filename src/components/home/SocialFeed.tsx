import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Rss } from "lucide-react";
import { useEffect } from "react";

export function SocialFeed() {
  const { data: feeds, isLoading, error } = useQuery({
    queryKey: ['social-feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data;
    },
    enabled: true // Always fetch data, even for logged-out users
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading social media feed. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

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