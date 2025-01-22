import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageFormProps {
  isSending: boolean;
  onSend: (message: string) => void;
  onCancel: () => void;
}

export function MessageForm({ isSending, onSend, onCancel }: MessageFormProps) {
  const [message, setMessage] = useState("");
  const isMobile = useIsMobile();

  const handleSubmit = () => {
    onSend(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      if (message.trim()) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        className={`min-h-[60px] resize-none ${isMobile ? 'max-h-[120px]' : 'max-h-[200px]'}`}
        rows={isMobile ? 2 : 4}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSending}
          size="sm"
          className="h-9"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
          size="sm"
          className="h-9 gap-2"
        >
          {isSending ? (
            "Sending..."
          ) : (
            <>
              Send <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}