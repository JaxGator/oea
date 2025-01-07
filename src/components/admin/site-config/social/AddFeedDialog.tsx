import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SocialFeed } from "../SocialMediaSettings";

interface AddFeedDialogProps {
  feeds: SocialFeed[];
  onFeedAdded: (feed: SocialFeed) => void;
}

export function AddFeedDialog({ feeds, onFeedAdded }: AddFeedDialogProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeed, setNewFeed] = useState({
    platform: 'instagram' as SocialFeed['platform'],
    embed_code: '',
    title: 'New Feed',
    is_enabled: false
  });

  const resetNewFeed = () => {
    setNewFeed({
      platform: 'instagram',
      embed_code: '',
      title: 'New Feed',
      is_enabled: false
    });
  };

  const addFeed = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .insert({
          platform: newFeed.platform,
          embed_code: newFeed.embed_code,
          display_order: feeds.length,
          title: newFeed.title,
          is_enabled: newFeed.is_enabled
        })
        .select()
        .single();

      if (error) throw error;
      
      onFeedAdded(data);
      setIsDialogOpen(false);
      resetNewFeed();
      
      toast({
        title: "Success",
        description: "New feed added successfully",
      });
    } catch (error) {
      console.error('Error adding feed:', error);
      toast({
        title: "Error",
        description: "Failed to add new feed",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetNewFeed();
    }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Feed
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Social Media Feed</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={newFeed.title}
              onChange={(e) => setNewFeed({ ...newFeed, title: e.target.value })}
              placeholder="Enter feed title"
            />
          </div>
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select
              value={newFeed.platform}
              onValueChange={(value) => setNewFeed({ ...newFeed, platform: value as SocialFeed['platform'] })}
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
          <div className="space-y-2">
            <Label>Embed Code</Label>
            <Input
              value={newFeed.embed_code}
              onChange={(e) => setNewFeed({ ...newFeed, embed_code: e.target.value })}
              placeholder="Enter embed code"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={newFeed.is_enabled}
              onCheckedChange={(checked) => setNewFeed({ ...newFeed, is_enabled: checked })}
            />
            <Label>Enable Feed</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={addFeed}>
            Save Feed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}