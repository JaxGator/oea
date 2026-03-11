
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MaintenanceMode } from "./technical/MaintenanceMode";
import { FaviconConfig } from "./technical/FaviconConfig";
import { ImageUploadField } from "./technical/ImageUploadField";
import { Card, CardContent } from "@/components/ui/card";

export function TechnicalSettings() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config' as any)
          .select('key, value');
        
        if (error) {
          throw error;
        }

        const configObj = data.reduce((acc: Record<string, string>, curr) => {
          acc[curr.key] = curr.value || "";
          return acc;
        }, {});

        setConfigs(configObj);
      } catch (error) {
        console.error('Error fetching site config:', error);
        toast({
          title: "Error",
          description: "Failed to load site configuration",
          variant: "destructive",
        });
      }
    };

    fetchConfigs();
  }, []);

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
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">Technical Settings</h2>
      
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <MaintenanceMode
              enabled={configs.maintenance_mode === 'true'}
              onToggle={(enabled) => updateConfig('maintenance_mode', enabled.toString())}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <FaviconConfig
              value={configs.favicon_url || ''}
              onChange={(value) => setConfigs(prev => ({ ...prev, favicon_url: value }))}
              onSave={() => updateConfig('favicon_url', configs.favicon_url || '')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <ImageUploadField
              label="Default Event Image"
              value={configs.default_event_image || ''}
              onChange={(value) => setConfigs(prev => ({ ...prev, default_event_image: value }))}
              onSave={async () => updateConfig('default_event_image', configs.default_event_image || '')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
