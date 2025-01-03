import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
  const { toast } = useToast();

  const fetchFeeds = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFeeds(data || []);
    } catch (error) {
      console.error('Error fetching feeds:', error);
      toast({
        title: "Error",
        description: "Failed to load social media feeds",
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

  useState(() => {
    fetchFeeds();
  }, []);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
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
  );
}