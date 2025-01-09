import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "../types";
import { useSession } from "@/hooks/auth/useSession";
import { toast } from "@/hooks/use-toast";

export function useMessageSending(recipient: Member, onSuccess: () => void) {
  const [isSending, setIsSending] = useState(false);
  const { user } = useSession();

  const sendMessage = async (content: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // Check if user can message the recipient
      const { data: canMessage, error: checkError } = await supabase
        .rpc('can_message_user', {
          target_user_id: recipient.id
        });

      if (checkError) throw new Error(checkError.message);
      
      if (!canMessage) {
        throw new Error("You cannot message this user");
      }

      // Send the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipient.id,
          content: content
        });

      if (messageError) throw new Error(messageError.message);

      onSuccess();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, isSending };
}