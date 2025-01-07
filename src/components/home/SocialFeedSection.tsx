import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SocialFeed {
  id: string;
  platform: string;
  embed_code: string;
  is_enabled: boolean;
  title: string;
}

export function SocialFeedSection() {
  const [feeds, setFeeds] = useState<SocialFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const { data, error } = await supabase
          .from('social_media_feeds')
          .select('*')
          .eq('is_enabled', true)
          .order('display_order');

        if (error) throw error;
        setFeeds(data || []);
      } catch (error) {
        console.error('Error fetching social feeds:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (feeds.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Social Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {feeds.map((feed) => (
          <Card key={feed.id}>
            <CardContent className="p-4">
              <div className="aspect-square">
                <div 
                  dangerouslySetInnerHTML={{ __html: feed.embed_code }}
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}