import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReminderSettings } from "./technical/ReminderSettings";

export function TechnicalSettings() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value');
        
        if (error) {
          throw error;
        }

        // Convert array of {key, value} pairs to a Record object
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Technical Settings</h2>
      <ReminderSettings
        eventId={configs.current_event_id || ''}
        enabled={configs.reminder_enabled === 'true'}
        intervals={configs.reminder_intervals ? JSON.parse(configs.reminder_intervals) : ["7d", "1d", "1h"]}
        onUpdate={() => {
          // Refresh configs after update
          setConfigs(prev => ({ ...prev }));
        }}
      />
    </div>
  );
}