
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { ConversationType } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationCardProps {
  conversation: ConversationType;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function ConversationCard({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  isDeleting
}: ConversationCardProps) {
  const displayName = conversation.isGroup 
    ? conversation.groupInfo?.name 
    : conversation.user.username;

  const participantCount = conversation.isGroup 
    ? conversation.groupInfo?.participants.length 
    : null;

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? "bg-accent" : "bg-card"
      }`}
      onClick={onSelect}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={conversation.user.avatar_url || ''} />
            <AvatarFallback>
              {conversation.isGroup ? (
                <Users className="h-4 w-4" />
              ) : (
                conversation.user.username?.[0]?.toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-medium truncate">{displayName}</h3>
              {conversation.unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
            
            {conversation.isGroup && participantCount && (
              <p className="text-xs text-muted-foreground">
                {participantCount} participants
              </p>
            )}
            
            {conversation.lastMessage && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {conversation.lastMessage.content}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              {conversation.lastMessage && format(new Date(conversation.lastMessage.created_at), 'MMM d, h:mm a')}
            </p>
          </div>

          {isSelected && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
