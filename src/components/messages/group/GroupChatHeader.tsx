
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GroupChat } from "@/types/communications";

interface GroupChatHeaderProps {
  groupChat: GroupChat;
  participantCount: number;
  onBack: () => void;
}

export function GroupChatHeader({ groupChat, participantCount, onBack }: GroupChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <Card className="border-b rounded-none px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="font-semibold">{groupChat.name}</h3>
            {groupChat.description && (
              <p className="text-sm text-muted-foreground">{groupChat.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Users className="h-4 w-4" />
                <span className="sr-only">Participants</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{participantCount} participants</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Group Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Group Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
}
