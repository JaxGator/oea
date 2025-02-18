
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "stream-chat-react";

export function NewDirectMessageDialog() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { client: chatClient } = useChatContext();

  const { data: users, isLoading } = useQuery({
    queryKey: ['messageable-users', searchTerm],
    queryFn: async () => {
      const { data: currentUser } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUser.user?.id)
        .ilike('username', `%${searchTerm}%`);
      
      if (error) throw error;
      return data;
    },
    enabled: open
  });

  const createChannelId = (id1: string, id2: string): string => {
    const shortId1 = id1.substring(0, 8);
    const shortId2 = id2.substring(0, 8);
    const sortedIds = [shortId1, shortId2].sort();
    return `dm_${sortedIds.join('_')}`;
  };

  const handleSelectUser = async (userId: string, username: string) => {
    if (!chatClient) {
      console.error('Chat client not initialized');
      toast({
        title: "Error",
        description: "Chat client not initialized. Please try refreshing the page.",
        variant: "destructive"
      });
      return;
    }

    if (isCreatingChat) {
      console.log('Already creating a chat, please wait...');
      return;
    }

    try {
      setIsCreatingChat(true);
      console.log('Starting chat creation process with user:', userId);

      const { data: canMessage } = await supabase.rpc('can_message_user', {
        target_user_id: userId
      });

      if (!canMessage) {
        throw new Error('Cannot message this user');
      }

      const { data: targetUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: currentUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', chatClient.userID!)
        .single();

      if (!targetUser || !currentUser) {
        throw new Error('Could not find user profiles');
      }

      // Create target user in Stream Chat using server-side function
      try {
        const { error } = await supabase.functions.invoke('upsert-stream-user', {
          body: {
            user: {
              id: targetUser.id,
              name: targetUser.username || targetUser.id,
              image: targetUser.avatar_url,
            }
          }
        });

        if (error) throw error;
        console.log('Target user created/updated in Stream Chat');
      } catch (error) {
        console.error('Error creating target user in Stream:', error);
        throw new Error('Failed to create target user in chat system');
      }

      const channelId = createChannelId(chatClient.userID!, userId);
      console.log('Creating channel with ID:', channelId);

      const channel = chatClient.channel('messaging', channelId, {
        members: [chatClient.userID!, userId],
        name: username,
      });

      const { channel: createdChannel } = await channel.create();
      console.log('Channel created:', createdChannel);

      await channel.watch();
      console.log('Channel watch successful');

      setOpen(false);
      navigate(`/messages/${channelId}`);
      
      toast({
        title: "Chat created",
        description: `You can now message ${username}`,
      });
    } catch (error) {
      console.error('Error in chat creation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create chat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Mail className="h-4 w-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : users?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No users found
              </p>
            ) : (
              <div className="space-y-2">
                {users?.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id, user.username)}
                    disabled={isCreatingChat}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-accent rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback>
                        {user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {user.username || user.full_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
