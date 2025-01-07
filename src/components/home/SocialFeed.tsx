import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function SocialFeed() {
  const { data: feeds, isLoading, error } = useQuery({
    queryKey: ['social-feeds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load social media feeds
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

  if (!feeds?.length) {
    return null;
  }

  return (
    <div className="mt-16 space-y-8">
      <h2 className="text-2xl font-bold text-center">Social Media</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {feeds.map((feed) => (
          <div key={feed.id} className="w-full">
            <h3 className="text-lg font-medium mb-4">{feed.platform}</h3>
            <div 
              dangerouslySetInnerHTML={{ __html: feed.feed_url }}
              className="w-full min-h-[300px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}