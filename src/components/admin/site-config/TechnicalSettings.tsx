import { MaintenanceMode } from "./technical/MaintenanceMode";
import { ImageUploadField } from "./technical/ImageUploadField";
import { FaviconConfig } from "./technical/FaviconConfig";
import { ReminderSettings } from "./technical/ReminderSettings";
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
            setConfigs(prev => ({ ...prev, default_event_image: value }));
            updateConfig('default_event_image', value);
          }}
          onSave={async () => {
            await updateConfig('default_event_image', configs.default_event_image || '');
          }}
        />

        <ReminderSettings
          eventId={configs.current_event_id || ''}
          enabled={configs.reminder_enabled === 'true'}
          intervals={configs.reminder_intervals ? JSON.parse(configs.reminder_intervals) : ["7d", "1d", "1h"]}
          onUpdate={() => {
            // Refresh configs after update
            setConfigs(prev => ({ ...prev }));
          }}
        />
      </CardContent>
    </Card>
  );
}