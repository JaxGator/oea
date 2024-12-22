import { Card, CardContent } from "@/components/ui/card";
import { MaintenanceMode } from "./technical/MaintenanceMode";
import { ImageUploadField } from "./technical/ImageUploadField";
import { CodeEditor } from "./technical/CodeEditor";
import { SitemapConfig } from "./technical/SitemapConfig";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type TechnicalSettingsProps = {
  configs: Record<string, string>;
  setConfigs: (configs: Record<string, string>) => void;
  isLoading?: boolean;
};

export function TechnicalSettings({ configs, setConfigs, isLoading }: TechnicalSettingsProps) {
  const { toast } = useToast();

  const updateConfig = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key, value })
        .select()
        .maybeSingle();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to be handled by the component
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <MaintenanceMode
          isEnabled={configs.maintenance_mode === 'true'}
          onToggle={(enabled) => {
            setConfigs({ ...configs, maintenance_mode: String(enabled) });
            updateConfig('maintenance_mode', String(enabled));
          }}
          isLoading={isLoading}
        />

        <ImageUploadField
          label="Default Event Image"
          value={configs.default_event_image || ""}
          onChange={(value) => setConfigs({ ...configs, default_event_image: value })}
          onSave={() => updateConfig('default_event_image', configs.default_event_image)}
          isLoading={isLoading}
        />

        <CodeEditor
          label="Custom Scripts"
          value={configs.custom_scripts || ""}
          onChange={(value) => setConfigs({ ...configs, custom_scripts: value })}
          onSave={() => updateConfig('custom_scripts', configs.custom_scripts)}
          isLoading={isLoading}
        />

        <SitemapConfig
          value={configs.sitemap_config || ""}
          onChange={(value) => setConfigs({ ...configs, sitemap_config: value })}
          onSave={() => updateConfig('sitemap_config', configs.sitemap_config)}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}