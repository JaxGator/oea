import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthState } from "@/hooks/useAuthState";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string | null;
  };
}

export function GroupChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatTitle, setChatTitle] = useState("Event Discussion");
  const { user, profile } = useAuthState();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchChatTitle = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'group_chat_title')
        .single();
      
      if (!error && data) {
        setChatTitle(data.value || "Event Discussion");
      }
    };

    fetchChatTitle();

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('group_chat_messages')
          .select(`
            *,
            sender:profiles!group_chat_messages_sender_id_fkey (
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
        setIsLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('group-chat')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'group_chat_messages'
        },
        async (payload) => {
          if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'INSERT') {
            const { data: senderData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', payload.new.sender_id)
              .single();

            const newMessage = {
              ...payload.new,
              sender: senderData
            } as ChatMessage;

            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  if (!profile?.is_approved && !profile?.is_admin) {
    return (
      <div className="p-4 text-center text-gray-500">
        Your account needs to be approved to participate in group chat.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      <ChatHeader 
        chatTitle={chatTitle}
        setChatTitle={setChatTitle}
        isAdmin={profile?.is_admin || false}
      />
      
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={user?.id}
                isAdmin={profile?.is_admin || false}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <ChatInput userId={user?.id} />
    </div>
  );
}