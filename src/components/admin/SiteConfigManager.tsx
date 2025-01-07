import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ConfigTabs } from "./site-config/ConfigTabs";
import { GeneralSettings } from "./site-config/GeneralSettings";
import { IntegrationsSettings } from "./site-config/IntegrationsSettings";
import { LegalSettings } from "./site-config/LegalSettings";
import { TechnicalSettings } from "./site-config/TechnicalSettings";
import { SocialSettings } from "./site-config/SocialSettings";
import { useConfigManager } from "./site-config/useConfigManager";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export function SiteConfigManager() {
  const { configs, setConfigs, updateConfig, isLoading } = useConfigManager();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Site Configuration</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage all aspects of your site including general settings, social media, legal documents, and technical configurations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <ConfigTabs />

        <TabsContent value="general">
          <GeneralSettings
            configs={configs}
            setConfigs={setConfigs}
            updateConfig={updateConfig}
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialSettings
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
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}