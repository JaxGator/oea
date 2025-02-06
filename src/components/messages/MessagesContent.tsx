
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
  const { deleteMessage, editMessage: editMessageMutation } = useMessageOperations();
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

  const handleEditMessage = (messageId: string, content: string) => {
    editMessageMutation({ messageId, content });
  };

  return (
    <div className="flex flex-col h-[100dvh] -mt-16 -mb-12">
      <div className={`grid gap-4 flex-1 overflow-hidden p-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-[350px,1fr]'}`}>
        {(!isMobile || !selectedConversation) && (
          <Card className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelect={setSelectedConversation}
              />
            </div>
          </Card>
        )}

        {(!isMobile || selectedConversation) && selectedConversationData && (
          <Card className="flex flex-col overflow-hidden">
            <ConversationHeader
              conversation={selectedConversationData}
              onBack={() => setSelectedConversation(null)}
              onDelete={() => setShowDeleteDialog(true)}
              isDeleting={isDeleting}
            />
            <ConversationContent
              messages={selectedConversationData.messages}
              currentUserId={user?.id || ''}
              onEdit={handleEditMessage}
              onDelete={deleteMessage}
            />
            <ConversationInput
              onSend={handleSendMessage}
              isSending={isSending}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
