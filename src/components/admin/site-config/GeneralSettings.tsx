import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

type GeneralSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function GeneralSettings({ configs, setConfigs, updateConfig }: GeneralSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Site Name</label>
          <div className="flex gap-2">
            <Input
              value={configs.site_name}
              onChange={(e) => setConfigs({ ...configs, site_name: e.target.value })}
              placeholder="Enter site name"
            />
            <Button
              onClick={() => updateConfig('site_name', configs.site_name)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Site Description</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.site_description}
              onChange={(e) => setConfigs({ ...configs, site_description: e.target.value })}
              placeholder="Enter site description"
            />
            <Button
              onClick={() => updateConfig('site_description', configs.site_description)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Social Links</label>
          <div className="space-y-4">
            {Object.entries(JSON.parse(configs.social_links || '{"facebook":"","instagram":"","youtube":""}')).map(([platform, url]) => (
              <div key={platform} className="flex gap-2">
                <Input
                  value={url as string}
                  onChange={(e) => {
                    const socialLinks = JSON.parse(configs.social_links);
                    socialLinks[platform] = e.target.value;
                    setConfigs({ ...configs, social_links: JSON.stringify(socialLinks) });
                  }}
                  placeholder={`Enter ${platform} URL`}
                />
              </div>
            ))}
            <Button
              onClick={() => updateConfig('social_links', configs.social_links)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save All Social Links
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}