import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchChatTitle();
    fetchMessages();

    const channel = supabase
      .channel('group-chat')
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
  }, []);

  return {
    messages,
    isLoading,
    chatTitle,
    setChatTitle
  };
}