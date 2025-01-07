import { MaintenanceMode } from "./technical/MaintenanceMode";
import { ImageUploadField } from "./technical/ImageUploadField";
import { CodeEditor } from "./technical/CodeEditor";
import { FaviconConfig } from "./technical/FaviconConfig";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TechnicalSettingsProps {
  configs: Record<string, any>;
  setConfigs: Dispatch<SetStateAction<Record<string, any>>>;
  isLoading: boolean;
}

export function TechnicalSettings({ configs, setConfigs, isLoading }: TechnicalSettingsProps) {
  const { toast } = useToast();

  const updateConfig = async (key: string, value: string) => {
    try {
      console.log('Updating config:', key, value);
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key,
          value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      // Update local state
      setConfigs(prev => ({ ...prev, [key]: value }));

      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <MaintenanceMode
          enabled={configs.maintenance_mode === 'true'}
          onToggle={(enabled) => {
            updateConfig('maintenance_mode', enabled.toString());
          }}
        />

        <FaviconConfig
          value={configs.favicon_url || ''}
          onChange={(value) => setConfigs(prev => ({ ...prev, favicon_url: value }))}
          onSave={() => updateConfig('favicon_url', configs.favicon_url || '')}
        />

        <ImageUploadField
          label="Default Event Image"
          value={configs.default_event_image || ''}
          onChange={(value) => {
            console.log('Image upload onChange:', value);
            setConfigs(prev => ({ ...prev, default_event_image: value }));
          }}
          onSave={async () => {
            console.log('Saving default_event_image:', configs.default_event_image);
            await updateConfig('default_event_image', configs.default_event_image || '');
          }}
        />

        <CodeEditor
          label="Custom Scripts"
          value={configs.custom_scripts || ""}
          onChange={(value) => setConfigs(prev => ({ ...prev, custom_scripts: value }))}
          onSave={() => updateConfig('custom_scripts', configs.custom_scripts || "")}
        />
      </CardContent>
    </Card>
  );
}