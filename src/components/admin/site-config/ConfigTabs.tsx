import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Share2, Scale, Wrench, Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ConfigTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Basic site settings like title, description, and contact information</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage social media links and feed integrations</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configure third-party service integrations and APIs</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Legal
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit terms of service and privacy policy documents</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Technical
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Advanced settings like maintenance mode, custom scripts, and favicon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TabsList>
  );
}