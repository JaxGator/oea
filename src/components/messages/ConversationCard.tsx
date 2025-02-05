
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
      className={`cursor-pointer hover:bg-accent/50 transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={conversation.user.avatar_url || ''} />
              <AvatarFallback>
                {conversation.isGroup ? (
                  <Users className="h-4 w-4" />
                ) : (
                  conversation.user.username?.[0]?.toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{displayName}</h3>
              {conversation.isGroup && participantCount && (
                <p className="text-xs text-muted-foreground">
                  {participantCount} participants
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {conversation.lastMessage && format(new Date(conversation.lastMessage.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {conversation.unreadCount > 0 && (
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-2 py-1 rounded-full">
                <div className="bg-primary w-2 h-2 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {conversation.unreadCount} unread
                </span>
              </div>
            )}
            {isSelected && (
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
