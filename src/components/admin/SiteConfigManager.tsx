
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

export default function SiteConfigManager() {
  const { configs, setConfigs, updateConfig, isLoading } = useConfigManager();

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pb-24 sm:pb-6 max-w-full overflow-x-hidden">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Site Configuration</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="touch-none focus:outline-none">
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[250px]">Manage all aspects of your site including general settings, social media, legal documents, and technical configurations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs defaultValue="general" className="space-y-4 w-full">
        <ConfigTabs />

        <div className="mt-6 overflow-x-hidden">
          <TabsContent value="general" className="m-0">
            <GeneralSettings
              configs={configs}
              setConfigs={setConfigs}
              updateConfig={updateConfig}
            />
          </TabsContent>

          <TabsContent value="social" className="m-0">
            <SocialSettings
              configs={configs}
              setConfigs={setConfigs}
              updateConfig={updateConfig}
            />
          </TabsContent>

          <TabsContent value="integrations" className="m-0">
            <IntegrationsSettings
              configs={configs}
              setConfigs={setConfigs}
              updateConfig={updateConfig}
            />
          </TabsContent>

          <TabsContent value="legal" className="m-0">
            <LegalSettings
              configs={configs}
              setConfigs={setConfigs}
              updateConfig={updateConfig}
            />
          </TabsContent>

          <TabsContent value="technical" className="m-0">
            <TechnicalSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
