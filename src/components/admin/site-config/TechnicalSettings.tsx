import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MaintenanceMode } from "./technical/MaintenanceMode";
import { ImageUploadField } from "./technical/ImageUploadField";
import { CodeEditor } from "./technical/CodeEditor";
import { SitemapConfig } from "./technical/SitemapConfig";

type TechnicalSettingsProps = {
  configs: Record<string, string>;
  setConfigs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  updateConfig: (key: string, value: string) => Promise<void>;
};

export function TechnicalSettings({ configs, setConfigs, updateConfig }: TechnicalSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MaintenanceMode
          enabled={configs.maintenance_mode === "true"}
          onChange={(checked) => {
            setConfigs({ ...configs, maintenance_mode: checked.toString() });
            updateConfig('maintenance_mode', checked.toString());
          }}
        />

        <ImageUploadField
          label="Default Meta Image"
          imageUrl={configs.default_meta_image}
          configKey="default_meta_image"
          updateConfig={updateConfig}
          setConfigs={setConfigs}
          imageType="metaImage"
        />

        <ImageUploadField
          label="Favicon"
          imageUrl={configs.favicon_url}
          configKey="favicon_url"
          updateConfig={updateConfig}
          setConfigs={setConfigs}
          imageType="favicon"
        />

        <CodeEditor
          label="Custom CSS"
          value={configs.custom_css || ""}
          onChange={(value) => setConfigs({ ...configs, custom_css: value })}
          onSave={() => updateConfig('custom_css', configs.custom_css)}
        />

        <CodeEditor
          label="Custom Scripts"
          value={configs.custom_scripts || ""}
          onChange={(value) => setConfigs({ ...configs, custom_scripts: value })}
          onSave={() => updateConfig('custom_scripts', configs.custom_scripts)}
        />

        <SitemapConfig
          value={configs.sitemap_config || ""}
          onChange={(value) => setConfigs({ ...configs, sitemap_config: value })}
          onSave={() => updateConfig('sitemap_config', configs.sitemap_config)}
        />
      </CardContent>
    </Card>
  );
}