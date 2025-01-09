import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Member } from "../types";
import { useSession } from "@/hooks/auth/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

interface SendMessageDialogProps {
  member: Member;
}

export function SendMessageDialog({ member }: SendMessageDialogProps) {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useSession();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!user?.id || !member?.id) {
      toast({
        title: "Error",
        description: "Missing user information",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // First check if the user can message the recipient
      const { data: canMessage, error: checkError } = await supabase
        .rpc('can_message_user', {
          target_user_id: member.id
        });

      if (checkError) {
        throw new Error(checkError.message);
      }

      if (!canMessage) {
        toast({
          title: "Cannot Send Message",
          description: "You cannot send messages to this user. Both users must be approved members.",
          variant: "destructive",
        });
        return;
      }

      // Create the communication record
      const { error: sendError } = await supabase
        .from('communications')
        .insert({
          subject: `Message from ${user.email}`,
          content: message,
          sender_id: user.id,
          recipient_type: 'user',
          recipient_data: { user_id: member.id },
          status: 'sent'
        });

      if (sendError) {
        throw new Error(sendError.message);
      }

      toast({
        title: "Success",
        description: "Message sent successfully",
      });
      
      setMessage("");
      setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message to {member.username}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}