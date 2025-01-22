import { useState } from "react";
import { Message } from "./types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ConversationMessageProps {
  message: Message;
  isCurrentUser: boolean;
  onEdit: (messageId: string, newContent: string) => void;
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

  return (
    <div className={cn(
      "group flex items-start gap-2 py-2",
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "flex flex-col max-w-[70%] rounded-lg p-3",
        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[60px]"
            />
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p>{message.content}</p>
            <span className="text-xs opacity-70">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
          </>
        )}
      </div>
      {isCurrentUser && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}