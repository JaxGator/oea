import { Globe, Settings, Scale, Wrench } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ConfigTabs() {
  return (
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
  );
}