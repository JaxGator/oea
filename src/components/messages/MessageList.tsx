import { ConversationType } from "./types";
import { useMessageOperations } from "@/hooks/messages/useMessageOperations";
import { useSession } from "@/hooks/auth/useSession";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConversationCard } from "./ConversationCard";
import { DeleteConversationDialog } from "./DeleteConversationDialog";

interface MessageListProps {
  conversations: Record<string, ConversationType>;
  selectedConversation: string | null;
  isSending: boolean;
  onSelect: (userId: string) => void;
  onMessageSend: (content: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function MessageList({
  conversations,
  selectedConversation,
  isSending,
  onSelect,
  onMessageSend,
  onCancel,
  onDelete,
}: MessageListProps) {
  const { user } = useSession();
  const { deleteMessage, editMessage } = useMessageOperations();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleDeleteConversation = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
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
      {Object.entries(conversations).map(([userId, conversation]) => (
        <ConversationCard
          key={userId}
          conversation={conversation}
          isSelected={selectedConversation === userId}
          onSelect={() => onSelect(userId)}
          onDelete={() => setShowDeleteDialog(true)}
          isDeleting={isDeleting}
        />
      ))}

      <DeleteConversationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteConversation}
      />
    </div>
  );
}