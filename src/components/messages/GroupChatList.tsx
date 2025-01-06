import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

interface GroupChat {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

interface GroupChatListProps {
  onSelectGroup: (groupId: string) => void;
  selectedGroupId: string | null;
}

export function GroupChatList({ onSelectGroup, selectedGroupId }: GroupChatListProps) {
  const { data: groupChats, isLoading } = useQuery({
    queryKey: ['groupChats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GroupChat[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!groupChats?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
        <Users className="h-12 w-12 mb-2 opacity-50" />
        <p className="text-center">No group chats yet</p>
        <p className="text-sm text-center">Create a new group chat to get started</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {groupChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectGroup(chat.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedGroupId === chat.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{chat.name}</p>
                <p className="text-sm opacity-70 truncate">
                  Created {new Date(chat.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}