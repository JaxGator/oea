import { Card } from "@/components/ui/card";
import { MessageForm } from "@/components/members/communication/MessageForm";
import { ConversationType } from "./types";
import { ConversationMessage } from "./ConversationMessage";
import { useMessageOperations } from "@/hooks/messages/useMessageOperations";
import { useSession } from "@/hooks/auth/useSession";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DeleteEventDialog } from "../event/DeleteEventDialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MessageListProps {
  conversations: Record<string, ConversationType>;
  selectedConversation: string | null;
  isSending: boolean;
  onConversationSelect: (id: string) => void;
  onMessageSend: (content: string) => void;
  onCancel: () => void;
}

export function MessageList({
  conversations,
  selectedConversation,
  isSending,
  onConversationSelect,
  onMessageSend,
  onCancel,
}: MessageListProps) {
  const { user } = useSession();
  const { deleteMessage, editMessage } = useMessageOperations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleDeleteConversation = async () => {
    if (!selectedConversation || !user) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq(user.id === conversations[selectedConversation].user.id ? 'sender_id' : 'receiver_id', 
            conversations[selectedConversation].user.id);

      if (error) throw error;

      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently deleted.",
      });
      
      onCancel(); // Close the conversation view
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {Object.values(conversations || {}).map((conversation) => (
        <Card 
          key={conversation.user.id} 
          className={`relative flex flex-col h-[calc(100dvh-12rem)] ${
            selectedConversation === conversation.user.id 
              ? 'ring-2 ring-primary' 
              : 'hover:bg-accent/50 cursor-pointer'
          }`}
          onClick={() => onConversationSelect(conversation.user.id)}
        >
          <div className="sticky top-0 z-10 p-6 border-b bg-background">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {conversation.user.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(conversation.lastMessage.created_at), 'MMM d, yyyy')}
                </p>
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
                {selectedConversation === conversation.user.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isMobile ? 'pb-32' : 'pb-6'}`}>
            {conversation.messages.map((message) => (
              <ConversationMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === user?.id}
                onEdit={(messageId, content) => editMessage({ messageId, content })}
                onDelete={deleteMessage}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {selectedConversation === conversation.user.id && (
            <div className="sticky bottom-0 p-6 bg-background border-t">
              <MessageForm
                isSending={isSending}
                onSend={onMessageSend}
                onCancel={onCancel}
              />
            </div>
          )}
        </Card>
      ))}

      <DeleteEventDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteConversation}
      />
    </div>
  );
}