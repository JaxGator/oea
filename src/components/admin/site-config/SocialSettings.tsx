import { SocialLinksManager } from "./social/SocialLinksManager";
import { useState } from "react";
import { useSocialLinks } from "@/hooks/useSocialLinks";

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
      <div>
        <h3 className="text-lg font-medium">Social Media Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your social media links and feeds
        </p>
      </div>

      <SocialLinksManager
        socialLinks={socialLinks}
        setSocialLinks={setSocialLinks}
      />
    </div>
  );
}