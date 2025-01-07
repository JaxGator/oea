import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SocialFeedFormProps {
  existingFeed: {
    platform: string;
    feed_url: string;
  } | null;
  onSave: () => void;
}

export function SocialFeedForm({ existingFeed, onSave }: SocialFeedFormProps) {
  const [embedCode, setEmbedCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (existingFeed) {
      setEmbedCode(existingFeed.feed_url);
    }
  }, [existingFeed]);

  const handleSave = async () => {
    try {
      // Delete any existing feeds first
      await supabase
        .from('social_media_feeds')
        .delete()
        .neq('id', 'placeholder');

      // Insert the new feed
      const { error } = await supabase
        .from('social_media_feeds')
        .insert({
          platform: 'Social Feed',
          feed_url: embedCode,
          is_active: true,
          display_order: 1
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social media feed saved successfully",
      });

      onSave();
    } catch (error) {
      console.error('Error saving social feed:', error);
      toast({
        title: "Error",
        description: "Failed to save social media feed",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (existingFeed) {
      setEmbedCode(existingFeed.feed_url);
    } else {
      setEmbedCode("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="embedCode" className="text-sm font-medium">
          Embed Code
        </label>
        <Textarea
          id="embedCode"
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          placeholder="Paste embed code here"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
        >
          <Check className="h-4 w-4 mr-1" />
          Save Feed
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}