import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useGroupChat } from "@/hooks/messages/useGroupChat";
import { Loader2 } from "lucide-react";

interface GroupChatMessagesProps {
  groupId: string;
  currentUserId: string;
}

export function GroupChatMessages({ groupId, currentUserId }: GroupChatMessagesProps) {
  const { messages, isLoading } = useGroupChat(groupId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages?.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 ${
            message.sender_id === currentUserId ? 'flex-row-reverse' : 'flex-row'
          } items-start mb-4`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar_url} />
            <AvatarFallback>
              {message.sender.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className={`flex flex-col ${
            message.sender_id === currentUserId ? 'items-end' : 'items-start'
          } max-w-[70%]`}>
            <div className={`
              rounded-lg px-4 py-2 break-words
              ${message.sender_id === currentUserId 
                ? 'bg-primary text-primary-foreground ml-auto' 
                : 'bg-muted'
              }
            `}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>{message.sender.username}</span>
              <span>•</span>
              <span>{format(new Date(message.created_at), 'MMM d, h:mm a')}</span>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}