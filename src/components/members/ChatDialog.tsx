import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChat } from "@/hooks/useChat";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  currentUserId: string;
}

export function ChatDialog({ 
  open, 
  onOpenChange, 
  recipientId, 
  recipientName,
  currentUserId 
}: ChatDialogProps) {
  const {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
  } = useChat();

  const onSubmit = (e: React.FormEvent) => {
    handleSendMessage(e, currentUserId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat with {recipientName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[400px]">
          <MessageList messages={messages} currentUserId={currentUserId} />
          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}