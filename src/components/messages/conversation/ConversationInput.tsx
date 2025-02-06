
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { ConversationInputProps } from "../types/conversation";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

export function ConversationInput({ onSend, isSending, receiverId }: ConversationInputProps) {
  const [message, setMessage] = useState("");
  const { user } = useAuthState();
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!user?.id || !receiverId) return;

    try {
      if (isTyping) {
        await supabase
          .from('typing_indicators')
          .upsert({
            user_id: user.id,
            chat_id: receiverId,
            chat_type: 'direct',
            started_at: new Date().toISOString()
          }, {
            onConflict: 'user_id, chat_id, chat_type'
          });
      } else {
        await supabase
          .from('typing_indicators')
          .delete()
          .match({
            user_id: user.id,
            chat_id: receiverId,
            chat_type: 'direct'
          });
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    updateTypingStatus(true);
    
    const timeout = setTimeout(() => {
      updateTypingStatus(false);
    }, 3000);
    
    setTypingTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      await onSend(message);
      setMessage("");
      updateTypingStatus(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      updateTypingStatus(false);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="Type a message..."
          className="min-h-[80px] max-h-[160px] resize-none"
        />
        <Button type="submit" disabled={!message.trim() || isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
