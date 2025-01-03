import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string | null;
  };
}

export function useGroupChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatTitle, setChatTitle] = useState("Event Discussion");
  const { toast } = useToast();

  useEffect(() => {
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

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('group_chat_messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            sender:profiles!group_chat_messages_sender_id_fkey (
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: "Error",
            description: "Failed to load messages. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        setMessages(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetchMessages:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchChatTitle();
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('group-chat-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
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
            } as Message;

            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    messages,
    isLoading,
    chatTitle,
    setChatTitle
  };
}