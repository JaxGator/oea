import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function SocialFeed() {
  const { data: feed, isLoading, error } = useQuery({
    queryKey: ['social-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  useEffect(() => {
    // Function to load scripts from feed URL
    const loadFeedScript = () => {
      if (!feed?.feed_url) return;

      // Extract script content from feed_url if it exists
      const scriptMatch = feed.feed_url.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      if (scriptMatch && scriptMatch[1]) {
        // Create and execute the script
        const scriptContent = scriptMatch[1];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.setAttribute('data-feed-script', 'true');
        
        // Extract src if it exists in the original script tag
        const srcMatch = feed.feed_url.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          script.src = srcMatch[1];
        } else {
          script.textContent = scriptContent;
        }
        
        document.body.appendChild(script);
      }
    };

    loadFeedScript();

    // Cleanup function to remove script when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[data-feed-script]');
      scripts.forEach(script => script.remove());
    };
  }, [feed]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load social media feed
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!feed) {
    return null;
  }

  return (
    <div className="mt-16 space-y-8">
      <h2 className="text-2xl font-bold text-center">Social Media</h2>
      <div className="w-full">
        <h3 className="text-lg font-medium mb-4">{feed.platform}</h3>
        <div 
          dangerouslySetInnerHTML={{ 
            __html: feed.feed_url.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          }}
          className="w-full min-h-[300px]"
        />
      </div>
    </div>
  );
}