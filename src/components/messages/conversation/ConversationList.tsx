import { ConversationCard } from "../ConversationCard";
import { ConversationListProps } from "../types/conversation";

export function ConversationList({ 
  conversations, 
  selectedConversation,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="space-y-2">
      {Object.entries(conversations).map(([userId, conversation]) => (
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
  );
}