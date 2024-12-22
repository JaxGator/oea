import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export function useChat() {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const { data: messages = [], refetch } = useQuery({
    queryKey: ['group-chat-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert({
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage("");
      refetch();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
  };
}