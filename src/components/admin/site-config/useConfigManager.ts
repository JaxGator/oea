import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useConfigManager() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config' as any)
        .select('key, value');
      
      if (error) throw error;

      const configObj = (data as any[]).reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value || "";
        return acc;
      }, {});

      setConfigs(configObj);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast({
        title: "Error",
        description: "Failed to load site configuration",
        variant: "destructive",
      });
    }
  };

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

  return { configs, setConfigs, updateConfig, isLoading };
}