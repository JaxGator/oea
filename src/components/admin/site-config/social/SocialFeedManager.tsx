import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface SocialFeed {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  embed_code: string;
  is_enabled: boolean;
  display_order: number;
  title: string;
}

interface SocialFeedManagerProps {
  feeds: SocialFeed[];
  setFeeds: (feeds: SocialFeed[]) => void;
}

export function SocialFeedManager({ feeds, setFeeds }: SocialFeedManagerProps) {
  const { toast } = useToast();

  const addFeed = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .insert({
          platform: 'instagram',
          embed_code: '',
          display_order: feeds.length,
          title: 'New Feed'
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

  return (
    <div className="space-y-4">
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
                  <Label>Title</Label>
                  <Input
                    value={feed.title}
                    onChange={(e) => updateFeed(feed.id, { title: e.target.value })}
                    placeholder="Enter feed title"
                  />
                </div>

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
              </div>

              <div className="flex-1">
                <Label>Embed Code</Label>
                <Input
                  value={feed.embed_code}
                  onChange={(e) => updateFeed(feed.id, { embed_code: e.target.value })}
                  placeholder="Enter embed code"
                />
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
    </div>
  );
}