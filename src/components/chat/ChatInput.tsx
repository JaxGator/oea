import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  chatId: string;
  userId: string;
  onMessageSent?: () => void;
}

export function ChatInput({ chatId, userId, onMessageSent }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert({
          chat_id: chatId,
          content: content.trim(),
          sender_id: userId
        });

      if (error) throw error;

      setContent("");
      onMessageSent?.();
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

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[80px]"
        />
        <Button 
          type="submit" 
          disabled={isSending || !content.trim()}
          className="self-end"
        >
          Send
        </Button>
      </div>
    </form>
  );
}