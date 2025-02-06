
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";
import { Message } from "@/components/messages/types";
import { ConversationType } from "@/components/messages/types/conversation";
import { MessagesProvider } from "@/components/messages/context/MessagesContext";
import { MessagesHeader } from "@/components/messages/MessagesHeader";
import { MessagesEmptyState } from "@/components/messages/MessagesEmptyState";
import { MessagesContent } from "@/components/messages/MessagesContent";
import { DeleteConversationDialog } from "@/components/messages/DeleteConversationDialog";
import { useMessages } from "@/components/messages/context/MessagesContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

interface GroupChat {
  id: string;
  name: string;
  description: string | null;
  messages: GroupMessage[];
}

interface GroupParticipation {
  group_chat: GroupChat;
}

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

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data: directMessages, error: directError } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (directError) throw directError;

      const { data: groupParticipations, error: groupError } = await supabase
        .from('group_chat_participants')
        .select(`
          group_chat:group_chats!inner(
            id,
            name,
            description,
            messages:group_chat_messages(
              id,
              content,
              created_at,
              sender:profiles!inner(
                id,
                username,
                avatar_url
              )
            )
          )
        `)
        .eq('user_id', user?.id);

      if (groupError) throw groupError;

      const typedGroupParticipations = groupParticipations as unknown as GroupParticipation[];
      
      const formattedGroupMessages = typedGroupParticipations?.map(participation => {
        const groupChat = participation.group_chat;
        return groupChat.messages.map(msg => ({
          ...msg,
          isGroupMessage: true,
          groupInfo: {
            id: groupChat.id,
            name: groupChat.name,
            description: groupChat.description
          }
        }));
      }).flat() || [];

      return [...directMessages, ...formattedGroupMessages].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!user,
  });

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
      
      queryClient.invalidateQueries({ queryKey: ['messages'] });
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

  if (!messages?.length) {
    return <MessagesEmptyState />;
  }

  const conversations = messages?.reduce((acc: Record<string, ConversationType>, message: Message) => {
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
