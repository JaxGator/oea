import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
          onClick={onCancel}
          disabled={isSending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
        >
          {isSending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
}