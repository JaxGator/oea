import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Settings, Scale, Wrench } from "lucide-react";
import { GeneralSettings } from "./site-config/GeneralSettings";
import { IntegrationsSettings } from "./site-config/IntegrationsSettings";
import { LegalSettings } from "./site-config/LegalSettings";
import { TechnicalSettings } from "./site-config/TechnicalSettings";

export function SiteConfigManager() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value');
      
      if (error) throw error;

      const configObj = data.reduce((acc: Record<string, string>, curr) => {
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
        .update({ value })
        .eq('key', key);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0 h-auto">
          <TabsTrigger value="general" className="w-full sm:w-auto justify-start sm:justify-center">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="integrations" className="w-full sm:w-auto justify-start sm:justify-center">
            <Settings className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="legal" className="w-full sm:w-auto justify-start sm:justify-center">
            <Scale className="h-4 w-4 mr-2" />
            Legal
          </TabsTrigger>
          <TabsTrigger value="technical" className="w-full sm:w-auto justify-start sm:justify-center">
            <Wrench className="h-4 w-4 mr-2" />
            Technical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings
            configs={configs}
            setConfigs={setConfigs}
            updateConfig={updateConfig}
          />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSettings
            configs={configs}
            setConfigs={setConfigs}
            updateConfig={updateConfig}
          />
        </TabsContent>

        <TabsContent value="legal">
          <LegalSettings
            configs={configs}
            setConfigs={setConfigs}
            updateConfig={updateConfig}
          />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalSettings
            configs={configs}
            setConfigs={setConfigs}
            updateConfig={updateConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}