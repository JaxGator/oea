import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type GeneralSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function GeneralSettings({ configs, setConfigs, updateConfig }: GeneralSettingsProps) {
  const handleColorChange = (key: string, value: string) => {
    setConfigs({ ...configs, [key]: value });
  };

  const saveThemeSettings = async () => {
    // Save all theme-related configs at once
    const themeKeys = [
      'button_primary_color',
      'button_hover_color',
      'page_background',
      'text_primary_color',
      'accent_color'
    ];

    for (const key of themeKeys) {
      await updateConfig(key, configs[key] || '');
    }
  };

  return (
    <div className="space-y-6">
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

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Button Color</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={configs.button_primary_color || '#0d97d1'}
                    onChange={(e) => handleColorChange('button_primary_color', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={configs.button_primary_color || '#0d97d1'}
                    onChange={(e) => handleColorChange('button_primary_color', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Button Hover Color</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={configs.button_hover_color || '#0b86bb'}
                    onChange={(e) => handleColorChange('button_hover_color', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={configs.button_hover_color || '#0b86bb'}
                    onChange={(e) => handleColorChange('button_hover_color', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Page Background</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={configs.page_background || '#ffffff'}
                    onChange={(e) => handleColorChange('page_background', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={configs.page_background || '#ffffff'}
                    onChange={(e) => handleColorChange('page_background', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Text Primary Color</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={configs.text_primary_color || '#000000'}
                    onChange={(e) => handleColorChange('text_primary_color', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={configs.text_primary_color || '#000000'}
                    onChange={(e) => handleColorChange('text_primary_color', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={configs.accent_color || '#0d97d1'}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={configs.accent_color || '#0d97d1'}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="flex-1"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                onClick={saveThemeSettings}
                className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
              >
                <Check className="h-4 w-4 mr-1" />
                Save Theme Settings
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

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
    </div>
  );
}