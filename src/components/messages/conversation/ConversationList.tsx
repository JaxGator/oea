
import { ConversationCard } from "../ConversationCard";
import { ConversationListProps } from "../types/conversation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ConversationList({ 
  conversations, 
  selectedConversation,
  onSelect,
}: ConversationListProps) {
  const directMessages = Object.entries(conversations).filter(([_, conv]) => !conv.isGroup);
  const groupChats = Object.entries(conversations).filter(([_, conv]) => conv.isGroup);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col space-y-4 p-4">
        {groupChats.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
              Group Chats
            </h3>
            <div className="space-y-2">
              {groupChats.map(([id, conversation]) => (
                <ConversationCard
                  key={id}
                  conversation={conversation}
                  isSelected={selectedConversation === id}
                  onSelect={() => onSelect(id)}
                  onDelete={() => {}}
                  isDeleting={false}
                />
              ))}
            </div>
          </div>
        )}

        {groupChats.length > 0 && directMessages.length > 0 && (
          <Separator className="my-2" />
        )}

        {directMessages.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
              Direct Messages
            </h3>
            <div className="space-y-2">
              {directMessages.map(([userId, conversation]) => (
                <ConversationCard
                  key={userId}
                  conversation={conversation}
                  isSelected={selectedConversation === userId}
                  onSelect={() => onSelect(userId)}
                  onDelete={() => {}}
                  isDeleting={false}
                />
              ))}
            </div>
          </div>
        )}

        {!groupChats.length && !directMessages.length && (
          <p className="text-center text-muted-foreground py-4">
            No conversations yet
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
