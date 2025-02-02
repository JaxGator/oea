import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageForm } from "@/components/members/communication/MessageForm";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

interface GroupChatDialogProps {
  groupId: string;
  groupName: string;
}

export function GroupChatDialog({ groupId, groupName }: GroupChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthState();

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert({
          group_chat_id: groupId,
          sender_id: user.id,
          content
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your message has been sent to the group.",
      });
      
    } catch (error) {
      console.error('Error sending group message:', error);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Group Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Group Chat: {groupName}</DialogTitle>
        </DialogHeader>
        <MessageForm
          isSending={isSending}
          onSend={handleSendMessage}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}