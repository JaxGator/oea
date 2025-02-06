
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";
import { Message, GroupChatRaw, GroupMessage } from "@/components/messages/types";
import { ConversationType } from "@/components/messages/types/conversation";
import { MessagesProvider } from "@/components/messages/context/MessagesContext";
import { MessagesHeader } from "@/components/messages/MessagesHeader";
import { MessagesEmptyState } from "@/components/messages/MessagesEmptyState";
import { MessagesContent } from "@/components/messages/MessagesContent";
import { DeleteConversationDialog } from "@/components/messages/DeleteConversationDialog";
import { useMessages } from "@/components/messages/context/MessagesContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useConversations } from "@/hooks/messages/useConversations";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

function MessagesPage() {
  const { user } = useAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    selectedConversation,
    setSelectedConversation,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    setIsDeleting
  } = useMessages();

  const { messages, isLoading } = useConversations(user?.id);

  const handleDeleteConversation = async () => {
    if (!selectedConversation || !user) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedConversation}),` +
          `and(sender_id.eq.${selectedConversation},receiver_id.eq.${user.id})`
        );

      if (error) throw error;

      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently deleted.",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!messages?.directMessages.length && !messages?.groupMessages.length) {
    return <MessagesEmptyState />;
  }

  // Transform direct messages into conversations
  const conversations = messages.directMessages.reduce<Record<string, ConversationType>>((acc, message) => {
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
    
    if (!acc[conversationId].lastMessage || 
        new Date(message.created_at) > new Date(acc[conversationId].lastMessage.created_at)) {
      acc[conversationId].lastMessage = message;
    }
    
    return acc;
  }, {});

  // Transform and add group conversations
  messages.groupMessages.forEach((group: GroupChatRaw) => {
    const groupMessages = group.messages.map(gm => ({
      id: gm.id,
      content: gm.content,
      created_at: gm.created_at,
      sender: gm.sender,
      sender_id: gm.sender.id,
      receiver_id: group.id,
      is_read: true,
      receiver: group.participants[0].user,
      group_chat: {
        id: group.id,
        name: group.name,
        description: group.description
      }
    } satisfies Message));

    conversations[group.id] = {
      user: group.participants[0].user,
      messages: groupMessages,
      lastMessage: groupMessages[0] || null,
      unreadCount: 0,
      isGroup: true,
      groupInfo: {
        id: group.id,
        name: group.name,
        description: group.description,
        participants: group.participants.map(p => p.user)
      }
    };
  });

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-8 mb-12">
        <MessagesHeader />
        <MessagesContent conversations={conversations} />
        <DeleteConversationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onDelete={handleDeleteConversation}
        />
      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <MessagesProvider>
      <MessagesPage />
    </MessagesProvider>
  );
}
