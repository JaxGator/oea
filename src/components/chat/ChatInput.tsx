import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  receiverId: string;
}

export function ChatInput({ receiverId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        content: message.trim(),
        receiver_id: receiverId,
      });

      if (error) throw error;

      setMessage("");
      toast({
        description: "Message sent successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[60px]"
        />
        <Button 
          type="submit" 
          disabled={isSending || !message.trim()} 
          className="self-end"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}