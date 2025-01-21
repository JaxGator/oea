import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReminderSettings } from "./ReminderSettings";

export function TechnicalSettings() {
  const [configs, setConfigs] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfigs = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching site config:', error);
        toast({
          title: "Error",
          description: "Failed to load site configuration",
          variant: "destructive",
        });
        return;
      }

      setConfigs(data);
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
