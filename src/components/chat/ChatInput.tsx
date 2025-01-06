import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  userId: string | undefined;
  chatId: string;
}

export function ChatInput({ userId, chatId }: ChatInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert({
          content: newMessage.trim(),
          sender_id: userId,
          chat_id: chatId
        });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[60px]"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}