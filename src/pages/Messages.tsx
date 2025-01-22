import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Card } from "@/components/ui/card";
import { Inbox, Loader2 } from "lucide-react";
import { useMessageSubscription } from "@/hooks/members/useMessageSubscription";
import { MessageForm } from "@/components/members/communication/MessageForm";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMessageReading } from "@/hooks/messages/useMessageReading";

export default function Messages() {
  const { user } = useAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { markMessagesAsRead } = useMessageReading();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          // Invalidate both messages and unread count queries
          queryClient.invalidateQueries({ queryKey: ['messages'] });
          queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation && user) {
      markMessagesAsRead({ 
        receiverId: user.id, 
        senderId: selectedConversation 
      });
      // Invalidate unread count after marking messages as read
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Inbox className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No messages yet</h3>
            <p className="text-muted-foreground">
              When you send or receive messages, they'll appear here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const conversations = messages?.reduce((acc: any, message: any) => {
    const otherUser = message.sender_id === user?.id ? message.receiver : message.sender;
    const conversationId = otherUser.id;
    
    if (!acc[conversationId]) {
      acc[conversationId] = {
        user: otherUser,
        messages: [],
        lastMessage: null,
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <div className="space-y-4">
        {Object.values(conversations || {}).map((conversation: any) => (
          <Card 
            key={conversation.user.id} 
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setSelectedConversation(conversation.user.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {conversation.user.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(conversation.lastMessage.created_at).toLocaleDateString()}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="bg-primary w-2 h-2 rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    {conversation.unreadCount} unread
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">
              {conversation.lastMessage.content}
            </p>
            {selectedConversation === conversation.user.id && (
              <MessageForm
                isSending={isSending}
                onSend={handleSendMessage}
                onCancel={() => setSelectedConversation(null)}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}