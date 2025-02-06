import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Card } from "@/components/ui/card";
import { Mail, Loader2, Inbox } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMessageOperations } from "@/hooks/messages/useMessageOperations";
import { ConversationList } from "@/components/messages/conversation/ConversationList";
import { ConversationHeader } from "@/components/messages/conversation/ConversationHeader";
import { ConversationContent } from "@/components/messages/conversation/ConversationContent";
import { ConversationInput } from "@/components/messages/conversation/ConversationInput";
import { DeleteConversationDialog } from "@/components/messages/DeleteConversationDialog";
import { CreateGroupChatDialog } from "@/components/messages/group/CreateGroupChatDialog";
import { NewDirectMessageDialog } from "@/components/messages/direct/NewDirectMessageDialog";
import { Message } from "@/components/messages/types";
import { ConversationType } from "@/components/messages/types/conversation";
import { useIsMobile } from "@/hooks/use-mobile";

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

export default function Messages() {
  const { user } = useAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteMessage, editMessage } = useMessageOperations();
  const isMobile = useIsMobile();

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

      // Type assertion to ensure correct typing
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

  const handleEditMessage = (messageId: string, content: string) => {
    editMessage({ messageId, content });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Mail className="h-7 w-7" />
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
          <div className="flex gap-2">
            <NewDirectMessageDialog />
            <CreateGroupChatDialog />
          </div>
        </div>
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Inbox className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No messages yet</h3>
              <p className="text-muted-foreground">
                Start a conversation or create a group chat to begin messaging.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
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

  const selectedConversationData = selectedConversation ? conversations[selectedConversation] : null;

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 py-8 mb-12">
        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-7 w-7" />
            <h1 className="text-3xl font-bold">Messages</h1>
          </div>
          <div className="flex gap-2">
            <NewDirectMessageDialog />
            <CreateGroupChatDialog />
          </div>
        </div>

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

        <DeleteConversationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onDelete={handleDeleteConversation}
        />
      </div>
    </div>
  );
}
