import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { ManageParticipantsDialog } from "./ManageParticipantsDialog";
import { useGroupChatRealtime } from "@/hooks/useGroupChatRealtime";

interface ChatWindowProps {
  selectedUserId: string | null;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export function ChatWindow({ selectedUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const { user } = useAuthState();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useGroupChatRealtime({
    chatId: selectedUserId || '',
    onParticipantAdded: (payload) => {
      setParticipants(prev => [...prev, payload.new.user_id]);
    },
    onParticipantRemoved: (payload) => {
      setParticipants(prev => prev.filter(id => id !== payload.old.user_id));
    },
    onMessageReceived: (payload) => {
      setMessages(prev => [...prev, payload.new]);
    },
  });

  useEffect(() => {
    if (!selectedUserId || !user) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${selectedUserId},receiver_id.eq.${selectedUserId}`)
          .order("created_at");

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        const { data: participantsData, error: participantsError } = await supabase
          .from("group_chat_participants")
          .select("user_id")
          .eq("chat_id", selectedUserId);

        if (participantsError) throw participantsError;
        setParticipants(participantsData.map(p => p.user_id));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load chat data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUserId, user, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !user) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          content: newMessage.trim(),
          sender_id: user.id,
          receiver_id: selectedUserId,
        },
      ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (!selectedUserId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a user to start messaging
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Chat</h2>
        <ManageParticipantsDialog
          chatId={selectedUserId}
          currentParticipants={participants}
        />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px]"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}