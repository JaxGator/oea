import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SocialFeed } from "../SocialMediaSettings";

interface AddFeedDialogProps {
  feeds: SocialFeed[];
  onFeedAdded: (feed: SocialFeed) => void;
}

export function AddFeedDialog({ feeds, onFeedAdded }: AddFeedDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_feeds')
        .insert({
          platform: 'instagram',
          embed_code: embedCode,
          display_order: feeds.length,
          title: 'New Feed',
          is_enabled: true
        })
        .select()
        .single();

      if (error) throw error;
      
      onFeedAdded(data);
      setIsOpen(false);
      setEmbedCode("");
      
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Input
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            placeholder="Paste embed code here"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Feed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}