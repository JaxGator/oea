import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationHeaderProps } from "../types/conversation";

export function ConversationHeader({ 
  conversation, 
  onBack, 
  onDelete,
  isDeleting 
}: ConversationHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src={conversation.user.avatar_url || ''} />
          <AvatarFallback>{conversation.user.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{conversation.user.username}</h2>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={isDeleting}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}