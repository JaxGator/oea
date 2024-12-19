import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

type TechnicalSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function TechnicalSettings({ configs, setConfigs, updateConfig }: TechnicalSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Maintenance Mode</label>
          <div className="flex items-center gap-2">
            <Switch
              checked={configs.maintenance_mode === "true"}
              onCheckedChange={(checked) => {
                setConfigs({ ...configs, maintenance_mode: checked.toString() });
                updateConfig('maintenance_mode', checked.toString());
              }}
            />
            <span className="text-sm text-muted-foreground">
              {configs.maintenance_mode === "true" ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Default Meta Image URL</label>
          <div className="flex gap-2">
            <Input
              value={configs.default_meta_image}
              onChange={(e) => setConfigs({ ...configs, default_meta_image: e.target.value })}
              placeholder="Enter default meta image URL"
            />
            <Button
              onClick={() => updateConfig('default_meta_image', configs.default_meta_image)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Favicon URL</label>
          <div className="flex gap-2">
            <Input
              value={configs.favicon_url}
              onChange={(e) => setConfigs({ ...configs, favicon_url: e.target.value })}
              placeholder="Enter favicon URL"
            />
            <Button
              onClick={() => updateConfig('favicon_url', configs.favicon_url)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom CSS</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.custom_css}
              onChange={(e) => setConfigs({ ...configs, custom_css: e.target.value })}
              placeholder="Enter custom CSS"
              className="font-mono"
            />
            <Button
              onClick={() => updateConfig('custom_css', configs.custom_css)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Scripts</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.custom_scripts}
              onChange={(e) => setConfigs({ ...configs, custom_scripts: e.target.value })}
              placeholder="Enter custom scripts"
              className="font-mono"
            />
            <Button
              onClick={() => updateConfig('custom_scripts', configs.custom_scripts)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sitemap Configuration</label>
          <div className="flex gap-2">
            <Textarea
              value={configs.sitemap_config}
              onChange={(e) => setConfigs({ ...configs, sitemap_config: e.target.value })}
              placeholder="Enter sitemap configuration in JSON format"
              className="font-mono min-h-[200px]"
            />
            <Button
              onClick={() => updateConfig('sitemap_config', configs.sitemap_config)}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}