import { useState, useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMessageReading } from "@/hooks/messages/useMessageReading";
import { useQueryClient } from "@tanstack/react-query";
import { MessageList } from "@/components/messages/MessageList";
import { LoadingState } from "@/components/messages/LoadingState";
import { EmptyState } from "@/components/messages/EmptyState";
import { useConversations } from "@/components/messages/useConversations";
import { ConversationType } from "@/components/messages/types";

export default function Messages() {
  const { user } = useAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { markMessagesAsRead } = useMessageReading();
  const { messages, isLoading } = useConversations(user?.id);

  useEffect(() => {
    if (selectedConversation && user) {
      markMessagesAsRead({ 
        receiverId: user.id, 
        senderId: selectedConversation 
      });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  }, [selectedConversation, user, markMessagesAsRead, queryClient]);

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
      setSelectedConversation(null);
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (!messages?.length) {
    return <EmptyState />;
  }

  const conversations = messages.reduce<Record<string, ConversationType>>((acc, message) => {
    const otherUser = message.sender_id === user?.id ? message.receiver : message.sender;
    const conversationId = otherUser.id;
    
    if (!acc[conversationId]) {
      acc[conversationId] = {
        user: otherUser,
        messages: [],
        lastMessage: message,
        unreadCount: 0
      };
    }
    
    acc[conversationId].messages.push(message);
    if (!message.is_read && message.receiver_id === user?.id) {
      acc[conversationId].unreadCount++;
    }
    
    if (new Date(message.created_at) > new Date(acc[conversationId].lastMessage.created_at)) {
      acc[conversationId].lastMessage = message;
    }
    
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <MessageList
        conversations={conversations}
        selectedConversation={selectedConversation}
        isSending={isSending}
        onConversationSelect={setSelectedConversation}
        onMessageSend={handleSendMessage}
        onCancel={() => setSelectedConversation(null)}
      />
    </div>
  );
}