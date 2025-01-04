import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SocialFeed {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  feed_url: string;
  is_enabled: boolean;
  display_order: number;
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

  const addFeed = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .insert({
          platform: 'instagram',
          feed_url: '',
          display_order: feeds.length,
        })
        .select()
        .single();

      if (error) throw error;
      setFeeds([...feeds, data]);
    } catch (error) {
      console.error('Error adding feed:', error);
      toast({
        title: "Error",
        description: "Failed to add new feed",
        variant: "destructive",
      });
    }
  };

  const updateFeed = async (id: string, updates: Partial<SocialFeed>) => {
    try {
      const { error } = await supabase
        .from('social_media_feeds')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setFeeds(feeds.map(feed => 
        feed.id === id ? { ...feed, ...updates } : feed
      ));

      toast({
        title: "Success",
        description: "Feed updated successfully",
      });
    } catch (error) {
      console.error('Error updating feed:', error);
      toast({
        title: "Error",
        description: "Failed to update feed",
        variant: "destructive",
      });
    }
  };

  const deleteFeed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media_feeds')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeeds(feeds.filter(feed => feed.id !== id));
      toast({
        title: "Success",
        description: "Feed deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting feed:', error);
      toast({
        title: "Error",
        description: "Failed to delete feed",
        variant: "destructive",
      });
    }
  };

  const updateSocialLinks = async () => {
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key: 'social_links',
          value: JSON.stringify(socialLinks),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social links updated successfully",
      });
    } catch (error) {
      console.error('Error updating social links:', error);
      toast({
        title: "Error",
        description: "Failed to update social links",
        variant: "destructive",
      });
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Links</h3>
            <div className="space-y-4">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <div key={platform} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      setSocialLinks(prev => ({
                        ...prev,
                        [platform]: e.target.value
                      }));
                    }}
                    placeholder={`Enter ${platform} URL`}
                  />
                </div>
              ))}
              <Button
                onClick={updateSocialLinks}
                className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Save Social Links
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Social Media Feeds</h3>
            <Button onClick={addFeed} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Feed
            </Button>
          </div>

        <div className="space-y-4">
          {feeds.map((feed) => (
            <div key={feed.id} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Label>Platform</Label>
                    <Select
                      value={feed.platform}
                      onValueChange={(value) => 
                        updateFeed(feed.id, { platform: value as SocialFeed['platform'] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label>Feed URL</Label>
                    <Input
                      value={feed.feed_url}
                      onChange={(e) => updateFeed(feed.id, { feed_url: e.target.value })}
                      placeholder="Enter feed URL"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={feed.is_enabled}
                    onCheckedChange={(checked) => 
                      updateFeed(feed.id, { is_enabled: checked })
                    }
                  />
                  <Label>Enable Feed</Label>
                </div>
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteFeed(feed.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
