import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Share2, Scale, Wrench, Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ConfigTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="general" className="flex items-center gap-2 w-full">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Basic site settings like title, description, and contact information</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="social" className="flex items-center gap-2 w-full">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manage social media links and feed integrations</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="integrations" className="flex items-center gap-2 w-full">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Configure third-party service integrations and APIs</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="legal" className="flex items-center gap-2 w-full">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Legal</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit terms of service and privacy policy documents</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="technical" className="flex items-center gap-2 w-full">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Technical</span>
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