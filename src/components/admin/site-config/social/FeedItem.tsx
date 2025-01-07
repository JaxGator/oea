import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { SocialFeed } from "../SocialMediaSettings";

interface FeedItemProps {
  feed: SocialFeed;
  onUpdate: (feed: SocialFeed) => void;
  onDelete: (id: string) => void;
}

export function FeedItem({ feed, onUpdate, onDelete }: FeedItemProps) {
  const { toast } = useToast();

  const updateFeed = async (updates: Partial<SocialFeed>) => {
    try {
      const { error } = await supabase
        .from('social_media_feeds')
        .update(updates)
        .eq('id', feed.id);

      if (error) throw error;

      onUpdate({ ...feed, ...updates });

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

  return (
    <div className="flex items-start space-x-4 p-4 border rounded-lg">
      <div className="flex-1 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label>Title</Label>
            <Input
              value={feed.title}
              onChange={(e) => updateFeed({ title: e.target.value })}
              placeholder="Enter feed title"
            />
          </div>

          <div className="flex-1">
            <Label>Platform</Label>
            <Select
              value={feed.platform}
              onValueChange={(value) => 
                updateFeed({ platform: value as SocialFeed['platform'] })
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
            onChange={(e) => updateFeed({ embed_code: e.target.value })}
            placeholder="Enter embed code"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={feed.is_enabled}
            onCheckedChange={(checked) => 
              updateFeed({ is_enabled: checked })
            }
          />
          <Label>Enable Feed</Label>
        </div>
      </div>

      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(feed.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}