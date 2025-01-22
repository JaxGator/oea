import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageFormProps {
  isSending: boolean;
  onSend: (message: string) => void;
  onCancel: () => void;
}

export function MessageForm({ isSending, onSend, onCancel }: MessageFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSend(message);
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSending}
          size="sm"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
          size="sm"
          className="gap-2"
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