
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

  const handleSelectUser = async (userId: string, username: string) => {
    if (!chatClient) {
      toast({
        title: "Error",
        description: "Chat client not initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Creating chat with user:', userId);
      
      const { data: canMessage } = await supabase.rpc('can_message_user', {
        target_user_id: userId
      });

      if (!canMessage) {
        toast({
          title: "Cannot send message",
          description: "You cannot message this user.",
          variant: "destructive"
        });
        return;
      }

      // Get user profiles for both users
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

      // Ensure both users exist in Stream Chat
      await chatClient.upsertUsers([
        {
          id: currentUser.id,
          name: currentUser.username || currentUser.full_name,
          image: currentUser.avatar_url,
        },
        {
          id: targetUser.id,
          name: targetUser.username || targetUser.full_name,
          image: targetUser.avatar_url,
        }
      ]);

      // Create a shorter unique channel ID using the first 8 characters of each UUID
      const members = [chatClient.userID!, userId].map(id => id.slice(0, 8)).sort();
      const channelId = `dm-${members.join('-')}`;
      
      console.log('Creating channel with ID:', channelId);
      
      // Create or get the channel
      const channel = chatClient.channel('messaging', channelId, {
        members: [chatClient.userID!, userId], // Use full IDs for members
        name: username, // Set the channel name to the recipient's username
      });

      // Watch the channel before creating it
      await channel.watch();
      
      // Then create the channel if it doesn't exist
      const { channel: createdChannel } = await channel.create();
      
      console.log('Channel created successfully:', createdChannel);
      
      setOpen(false);
      toast({
        title: "Chat created",
        description: `You can now message ${username}`,
      });

      // Force a refresh of the channel list
      await chatClient.queryChannels({
        type: 'messaging',
        members: { $in: [chatClient.userID!] }
      });

    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Failed to create chat. Please try again.",
        variant: "destructive"
      });
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
                    className="w-full flex items-center space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
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
