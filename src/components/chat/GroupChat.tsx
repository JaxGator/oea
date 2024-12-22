import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthState } from "@/hooks/useAuthState";
import { Input } from "@/components/ui/input";
import { Pencil, Check } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string | null;
  };
}

export function GroupChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [chatTitle, setChatTitle] = useState("Event Discussion");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const { toast } = useToast();
  const { user, profile } = useAuthState();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch chat title
    const fetchChatTitle = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'group_chat_title')
        .single();
      
      if (!error && data) {
        setChatTitle(data.value || "Event Discussion");
      }
    };

    fetchChatTitle();

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('group_chat_messages')
          .select(`
            *,
            sender:profiles!group_chat_messages_sender_id_fkey (
              username,
              avatar_url
            )
          `)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
        setIsLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('group-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages'
        },
        async (payload) => {
          const { data: senderData } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMessage = {
            ...payload.new,
            sender: senderData
          } as ChatMessage;

          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('group_chat_messages')
        .insert([
          {
            content: newMessage.trim(),
            sender_id: user.id,
          }
        ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTitle = async () => {
    if (!tempTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('site_config')
        .update({ value: tempTitle })
        .eq('key', 'group_chat_title');

      if (error) throw error;

      setChatTitle(tempTitle);
      setIsEditingTitle(false);
      toast({
        title: "Success",
        description: "Chat title updated successfully",
      });
    } catch (error) {
      console.error('Error updating chat title:', error);
      toast({
        title: "Error",
        description: "Failed to update chat title",
        variant: "destructive",
      });
    }
  };

  if (!profile?.is_approved && !profile?.is_admin) {
    return (
      <div className="p-4 text-center text-gray-500">
        Your account needs to be approved to participate in group chat.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        {isEditingTitle && profile?.is_admin ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="max-w-md"
              placeholder="Enter chat title"
            />
            <Button
              onClick={handleUpdateTitle}
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{chatTitle}</h2>
            {profile?.is_admin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTempTitle(chatTitle);
                  setIsEditingTitle(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender_id === user?.id ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.sender_id === user?.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  } rounded-lg p-3`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.sender?.username}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px]"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}