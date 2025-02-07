
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
import { Loader2 } from "lucide-react";

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
    if (!selectedConversation || !user) {
      toast({
        title: "Error",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    console.log('Sending message:', { sender: user.id, receiver: selectedConversation, content });
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
        title: "Success",
        description: "Message sent successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['messages', user.id] });
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
    console.log('Editing message:', { messageId, content });
    editMessageMutation({ messageId, content });
  };

  const handleDeleteConversation = () => {
    if (!selectedConversation || !user) return;
    setShowDeleteDialog(true);
  };

  return (
    <div className="h-[100dvh] bg-background pt-16 pb-4 px-4 md:px-8">
      <div className="container mx-auto h-full max-w-6xl">
        <div className={`grid h-full gap-4 ${
          isMobile ? 'grid-cols-1' : 'md:grid-cols-[350px,1fr]'
        }`}>
          {(!isMobile || !selectedConversation) && (
            <Card className="h-full overflow-hidden border">
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelect={setSelectedConversation}
              />
            </Card>
          )}

          {(!isMobile || selectedConversation) && (
            <Card className="flex h-full flex-col overflow-hidden border">
              {selectedConversationData ? (
                <>
                  <ConversationHeader
                    conversation={selectedConversationData}
                    onBack={() => setSelectedConversation(null)}
                    onDelete={handleDeleteConversation}
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
                    receiverId={selectedConversation}
                  />
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
