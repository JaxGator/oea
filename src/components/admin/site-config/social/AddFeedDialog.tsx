import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SocialFeed } from "../SocialMediaSettings";

interface AddFeedDialogProps {
  feeds: SocialFeed[];
  onFeedAdded: (feed: SocialFeed) => void;
}

export function AddFeedDialog({ feeds, onFeedAdded }: AddFeedDialogProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");

  const handleSave = async () => {
    if (!embedCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an embed code",
        variant: "destructive",
      });
      return;
    }

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
      setDialogOpen(false);
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

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEmbedCode(""); // Reset form when dialog closes
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Plus className="h-4 w-4 mr-2" />
          Add Feed
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Social Media Feed</DialogTitle>
          <DialogDescription>
            Paste your social media embed code below to add a new feed to your site.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            placeholder="Paste embed code here"
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!embedCode.trim()}
          >
            Save Feed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}