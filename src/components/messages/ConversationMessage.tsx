import { useState } from "react";
import { Message } from "./types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
}

export function ConversationMessage({ 
  message, 
  isCurrentUser,
  onEdit,
  onDelete 
}: ConversationMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleSaveEdit = () => {
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`group flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start mb-4`}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={isCurrentUser ? message.sender.avatar_url : message.receiver.avatar_url} />
        <AvatarFallback>
          {getInitials(isCurrentUser ? message.sender.username : message.receiver.username)}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`
          rounded-2xl px-4 py-2 shadow-sm
          ${isCurrentUser 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-muted rounded-tl-none'
          }
        `}>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[60px] bg-background"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim() || editedContent === message.content}
                  className="h-8"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{format(new Date(message.created_at), 'MMM d, h:mm a')}</span>
          {isCurrentUser && !isEditing && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6"
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(message.id)}
                className="h-6 w-6 text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}