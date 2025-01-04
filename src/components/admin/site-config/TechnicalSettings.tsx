import { MaintenanceMode } from "./technical/MaintenanceMode";
import { ImageUploadField } from "./technical/ImageUploadField";
import { CodeEditor } from "./technical/CodeEditor";
import { GallerySettings } from "./technical/GallerySettings";
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

  const handleGallerySettingsSave = async (settings: { carouselEnabled: boolean; carouselInterval: number }) => {
    await updateConfig('gallery_carousel_enabled', settings.carouselEnabled.toString());
    await updateConfig('gallery_carousel_interval', settings.carouselInterval.toString());
    setConfigs(prev => ({
      ...prev,
      gallery_carousel_enabled: settings.carouselEnabled.toString(),
      gallery_carousel_interval: settings.carouselInterval.toString()
    }));
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <MaintenanceMode
          enabled={configs.maintenance_mode === 'true'}
          onToggle={(enabled) => {
            setConfigs(prev => ({ ...prev, maintenance_mode: enabled.toString() }));
            updateConfig('maintenance_mode', enabled.toString());
          }}
        />

        <GallerySettings
          carouselEnabled={configs.gallery_carousel_enabled === 'true'}
          carouselInterval={parseInt(configs.gallery_carousel_interval || '5000')}
          onSave={handleGallerySettingsSave}
        />

        <ImageUploadField
          label="Default Event Image"
          value={configs.default_event_image || ''}
          onChange={(value) => setConfigs(prev => ({ ...prev, default_event_image: value }))}
          onSave={() => updateConfig('default_event_image', configs.default_event_image || '')}
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