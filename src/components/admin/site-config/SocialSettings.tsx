import { SocialLinksManager } from "./social/SocialLinksManager";
import { SocialFeedManager } from "./social/SocialFeedManager";
import { useState } from "react";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface SocialSettingsProps {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => void;
}

export function SocialSettings({ configs, setConfigs, updateConfig }: SocialSettingsProps) {
  const { data: initialSocialLinks } = useSocialLinks();
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks || {
    facebook: "",
    instagram: "",
    youtube: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Social Media Settings</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure your social media profiles and feed integrations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-sm text-muted-foreground">
        Configure your social media links and feeds
      </p>

      <SocialLinksManager
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />

      <Separator className="my-6" />

      <SocialFeedManager />
    </div>
  );
}