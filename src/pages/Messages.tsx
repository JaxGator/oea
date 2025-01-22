import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Card } from "@/components/ui/card";
import { Inbox, Loader2 } from "lucide-react";
import { useMessageSubscription } from "@/hooks/members/useMessageSubscription";

export default function Messages() {
  const { user } = useAuthState();

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

  // Group messages by conversation
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
    
    // Track the most recent message
    if (!acc[conversationId].lastMessage || 
        new Date(message.created_at) > new Date(acc[conversationId].lastMessage.created_at)) {
      acc[conversationId].lastMessage = message;
    }
    
    return acc;
  }, {});

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <div className="space-y-4">
        {Object.values(conversations || {}).map((conversation: any) => (
          <Card key={conversation.user.id} className="p-4">
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
          </Card>
        ))}
      </div>
    </div>
  );
}