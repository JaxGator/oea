import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserSelectProps {
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

interface User {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function UserSelect({ selectedUsers, onSelectUser, onRemoveUser }: UserSelectProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('is_approved', true)
        .order('username');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedUsers.map(userId => {
          const user = users.find(u => u.id === userId);
          if (!user) return null;

          return (
            <Badge key={userId} variant="secondary" className="flex items-center gap-1">
              {user.username}
              <button
                onClick={() => onRemoveUser(userId)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      <ScrollArea className="h-[200px] border rounded-md p-2">
        {users
          .filter(user => !selectedUsers.includes(user.id))
          .map(user => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className="w-full p-2 flex items-center gap-2 hover:bg-accent rounded-md"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </button>
          ))}
      </ScrollArea>
    </div>
  );
}