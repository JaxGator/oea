
import { Card } from "@/components/ui/card";
import { ConversationType } from "./types/conversation";
import { ConversationList } from "./conversation/ConversationList";
import { ConversationHeader } from "./conversation/ConversationHeader";
import { ConversationContent } from "./conversation/ConversationContent";
import { ConversationInput } from "./conversation/ConversationInput";
import { DeleteConversationDialog } from "./DeleteConversationDialog";
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
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    setIsDeleting,
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
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    editMessageMutation({ messageId, content });
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation || !user) {
      toast({
        title: "Error",
        description: "No conversation selected.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Deleting conversation between:', { user: user.id, other: selectedConversation });
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation}),` +
          `and(sender_id.eq.${selectedConversation},receiver_id.eq.${user.id})`
        );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Conversation deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ['messages', user.id] });
      setSelectedConversation(null);
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
    <>
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
                  onDelete={(userId) => {
                    setSelectedConversation(userId);
                    setShowDeleteDialog(true);
                  }}
                  isDeleting={isDeleting}
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
                      isSending={false}
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

      <DeleteConversationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteConversation}
      />
    </>
  );
}
