
import { Card } from "@/components/ui/card";
import { ConversationType } from "./types/conversation";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationHeader } from "./conversation/ConversationHeader";
import { ConversationContent } from "./conversation/ConversationContent";
import { ConversationInput } from "./conversation/ConversationInput";
import { useMessages } from "./context/MessagesContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessageOperations } from "@/hooks/messages/useMessageOperations";
import { useAuthState } from "@/hooks/useAuthState";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MessagesContentProps {
  conversations: Record<string, ConversationType>;
}

export function MessagesContent({ conversations }: MessagesContentProps) {
  const { user } = useAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { deleteMessage, editMessage } = useMessageOperations();
  const {
    selectedConversation,
    setSelectedConversation,
    setShowDeleteDialog,
    isDeleting,
    isSending,
    setIsSending
  } = useMessages();

  const selectedConversationData = selectedConversation ? conversations[selectedConversation] : null;

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation,
          content,
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-[350px,1fr]'}`}>
      {(!isMobile || !selectedConversation) && (
        <Card className="p-4 h-[calc(100vh-16rem)]">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelect={setSelectedConversation}
          />
        </Card>
      )}

      {(!isMobile || selectedConversation) && selectedConversationData && (
        <Card className="flex flex-col h-[calc(100vh-16rem)]">
          <ConversationHeader
            conversation={selectedConversationData}
            onBack={() => setSelectedConversation(null)}
            onDelete={() => setShowDeleteDialog(true)}
            isDeleting={isDeleting}
          />
          <ConversationContent
            messages={selectedConversationData.messages}
            currentUserId={user?.id || ''}
            onEdit={editMessage}
            onDelete={deleteMessage}
          />
          <ConversationInput
            onSend={handleSendMessage}
            isSending={isSending}
          />
        </Card>
      )}
    </div>
  );
}
