import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Member } from "../types";
import { MessageCircle } from "lucide-react";
import { MessageForm } from "./MessageForm";
import { useMessageSending } from "./useMessageSending";
import { useToast } from "@/hooks/use-toast";

interface SendMessageDialogProps {
  member: Member;
}

export function SendMessageDialog({ member }: SendMessageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { sendMessage, isSending } = useMessageSending(member, () => {
    setIsOpen(false);
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${member.username}`,
    });
  });

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
        <MessageForm
          isSending={isSending}
          onSend={sendMessage}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}