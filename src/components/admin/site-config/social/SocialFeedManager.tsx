import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SocialFeedManager() {
  const [title, setTitle] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('social_media_feeds')
        .insert({
          platform: title,
          feed_url: embedCode,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social media feed saved successfully",
      });

      // Reset form
      setTitle("");
      setEmbedCode("");
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
    setTitle("");
    setEmbedCode("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Social Media Feed</h3>
        <p className="text-sm text-muted-foreground">
          Add social media feed embed codes to display on the homepage
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Feed Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter feed title"
          />
        </div>

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
    </div>
  );
}