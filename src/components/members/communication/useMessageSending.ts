import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Member } from "../types";
import { useSession } from "@/hooks/auth/useSession";

export function useMessageSending(member: Member, onSuccess: () => void) {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useSession();

  const sendMessage = async (message: string) => {
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
      const { data: canMessage, error: checkError } = await supabase
        .rpc('can_message_user', {
          target_user_id: member.id
        });

      if (checkError) throw new Error(checkError.message);

      if (!canMessage) {
        toast({
          title: "Cannot Send Message",
          description: "You cannot send messages to this user. Both users must be approved members.",
          variant: "destructive",
        });
        return;
      }

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: member.id,
          content: message,
        });

      if (messageError) throw new Error(messageError.message);

      onSuccess();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendMessage,
    isSending
  };
}