import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Calendar, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ReportsTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="user-activity" className="flex items-center gap-2 w-full">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User Activity</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View user registration and activity metrics</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="event-participation" className="flex items-center gap-2 w-full">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Event Participation</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Analyze event attendance and engagement</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger value="system-usage" className="flex items-center gap-2 w-full">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">System Usage</span>
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Monitor system performance and usage metrics</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TabsList>
  );
}