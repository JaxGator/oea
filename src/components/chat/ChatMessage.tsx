import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    sender?: {
      username: string;
      avatar_url: string | null;
    };
  };
  currentUserId: string | undefined;
  isAdmin: boolean;
}

export function ChatMessage({ message, currentUserId, isAdmin }: ChatMessageProps) {
  const { toast } = useToast();

  const handleDeleteMessage = async () => {
    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`flex gap-2 ${
        message.sender_id === currentUserId ? 'flex-row-reverse' : ''
      }`}
    >
      <div
        className={`max-w-[80%] ${
          message.sender_id === currentUserId
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100'
        } rounded-lg p-3 relative group`}
      >
        <div className="text-sm font-medium mb-1">
          {message.sender?.username}
        </div>
        <div>{message.content}</div>
        <div className="text-xs opacity-70 mt-1">
          {new Date(message.created_at).toLocaleTimeString()}
        </div>
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteMessage}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
    </div>
  );
}