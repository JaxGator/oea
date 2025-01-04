import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface SocialLinksManagerProps {
  socialLinks: Record<string, string>;
  setSocialLinks: (links: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
}

export function SocialLinksManager({ socialLinks, setSocialLinks }: SocialLinksManagerProps) {
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Social Links</h3>
      <div className="space-y-4">
        {Object.entries(socialLinks).map(([platform, url]) => (
          <div key={platform} className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => {
                setSocialLinks((prev) => ({
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
  );
}