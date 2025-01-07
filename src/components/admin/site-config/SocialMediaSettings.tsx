import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SocialLinksManager } from "./social/SocialLinksManager";
import { SocialFeedManager } from "./social/SocialFeedManager";

export interface SocialFeed {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  embed_code: string;
  is_enabled: boolean;
  display_order: number;
  title: string;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

export function SocialMediaSettings() {
  const [feeds, setFeeds] = useState<SocialFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchFeeds = async () => {
    try {
      const [feedsResponse, configResponse] = await Promise.all([
        supabase.from('social_media_feeds').select('*').order('display_order'),
        supabase.from('site_config').select('value').eq('key', 'social_links').single()
      ]);

      if (feedsResponse.error) throw feedsResponse.error;
      if (configResponse.error) throw configResponse.error;

      setFeeds(feedsResponse.data || []);
      setSocialLinks(JSON.parse(configResponse.data?.value || '{"facebook":"","instagram":"","youtube":""}'));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load social media settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <SocialLinksManager 
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
          />
          
          <Separator className="my-6" />
          
          <SocialFeedManager 
            feeds={feeds}
            setFeeds={setFeeds}
          />
        </CardContent>
      </Card>
    </div>
  );
}