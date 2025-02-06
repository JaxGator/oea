
import { ConversationCard } from "../ConversationCard";
import { ConversationListProps } from "../types/conversation";
import { Separator } from "@/components/ui/separator";

export function ConversationList({ 
  conversations, 
  selectedConversation,
  onSelect,
}: ConversationListProps) {
  // Separate direct messages and group chats
  const directMessages = Object.entries(conversations).filter(([_, conv]) => !conv.isGroup);
  const groupChats = Object.entries(conversations).filter(([_, conv]) => conv.isGroup);

  return (
    <div className="h-full flex flex-col">
      {groupChats.length > 0 && (
        <div className="flex-shrink-0">
          <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Group Chats</h3>
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
        <Separator className="my-4" />
      )}

      {directMessages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Direct Messages</h3>
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
  );
}
