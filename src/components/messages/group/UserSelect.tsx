
import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserSelectProps {
  selectedUsers: string[];
  onSelectUsers: (users: string[]) => void;
}

export function UserSelect({ selectedUsers, onSelectUsers }: UserSelectProps) {
  const { toast } = useToast();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user) throw new Error("No authenticated user");

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUser.user.id);
        
        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
  });

  const toggleUser = (userId: string) => {
    const newSelected = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    onSelectUsers(newSelected);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !users) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Unable to load users. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] border rounded-md p-2">
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            No other users found
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onCheckedChange={() => toggleUser(user.id)}
              />
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || ''} />
                <AvatarFallback>
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {user.username || user.full_name}
              </span>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
