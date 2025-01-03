import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface UserListProps {
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
}

interface User {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function UserList({ onSelectUser, selectedUserId }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .neq('id', user?.id)
          .eq('is_approved', true);

        if (profilesError) throw profilesError;
        setUsers(profilesData || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-2 p-4">
        {users.map((user) => (
          <Button
            key={user.id}
            variant={selectedUserId === user.id ? "default" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => onSelectUser(user.id)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{user.username}</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}