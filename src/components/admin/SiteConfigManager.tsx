import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ConfigTabs } from "./site-config/ConfigTabs";
import { GeneralSettings } from "./site-config/GeneralSettings";
import { IntegrationsSettings } from "./site-config/IntegrationsSettings";
import { LegalSettings } from "./site-config/LegalSettings";
import { TechnicalSettings } from "./site-config/TechnicalSettings";
import { useConfigManager } from "./site-config/useConfigManager";

export function SiteConfigManager() {
  const { configs, setConfigs, updateConfig, isLoading } = useConfigManager();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <ConfigTabs />

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