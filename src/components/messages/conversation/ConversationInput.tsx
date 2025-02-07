
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { ConversationInputProps } from "../types/conversation";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useToast } from "@/hooks/use-toast";

export function ConversationInput({ onSend, isSending, receiverId }: ConversationInputProps) {
  const [message, setMessage] = useState("");
  const { user } = useAuthState();
  const { toast } = useToast();
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!user?.id || !receiverId) return;

    try {
      if (isTyping) {
        const { error } = await supabase
          .from('typing_indicators')
          .upsert({
            user_id: user.id,
            chat_id: receiverId,
            chat_type: 'direct',
            started_at: new Date().toISOString()
          }, {
            onConflict: 'user_id, chat_id, chat_type'
          });

        if (error) {
          console.error('Error updating typing status:', error);
        }
      } else {
        const { error } = await supabase
          .from('typing_indicators')
          .delete()
          .match({
            user_id: user.id,
            chat_id: receiverId,
            chat_type: 'direct'
          });

        if (error && error.code !== '42501') { // Ignore RLS policy violations on delete
          console.error('Error clearing typing status:', error);
        }
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    if (e.target.value.trim()) {
      updateTypingStatus(true);
      
      const timeout = setTimeout(() => {
        updateTypingStatus(false);
      }, 3000);
      
      setTypingTimeout(timeout);
    } else {
      updateTypingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      await updateTypingStatus(false);
      await onSend(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
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
        <Button 
          type="submit" 
          disabled={!message.trim() || isSending}
          className="flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
