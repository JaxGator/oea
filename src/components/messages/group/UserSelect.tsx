
import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface UserSelectProps {
  selectedUsers: string[];
  onSelectUsers: (users: string[]) => void;
}

export function UserSelect({ selectedUsers, onSelectUsers }: UserSelectProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: currentUser } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser.user?.id);
      
      if (error) throw error;
      return data;
    }
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

  return (
    <ScrollArea className="h-[200px] border rounded-md p-2">
      <div className="space-y-2">
        {users?.map((user) => (
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
        ))}
      </div>
    </ScrollArea>
  );
}
