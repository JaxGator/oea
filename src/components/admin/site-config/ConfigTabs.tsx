import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Share2, Scale, Wrench, Globe } from "lucide-react";

export function ConfigTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
      <TabsTrigger value="general" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        General
      </TabsTrigger>
      <TabsTrigger value="social" className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Social
      </TabsTrigger>
      <TabsTrigger value="integrations" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Integrations
      </TabsTrigger>
      <TabsTrigger value="legal" className="flex items-center gap-2">
        <Scale className="h-4 w-4" />
        Legal
      </TabsTrigger>
      <TabsTrigger value="technical" className="flex items-center gap-2">
        <Wrench className="h-4 w-4" />
        Technical
      </TabsTrigger>
    </TabsList>
  );
}