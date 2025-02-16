import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Users, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSelect } from "./UserSelect";
import { useChatContext } from "@/context/chat-context";

export function CreateGroupChatDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { client: chatClient } = useChatContext();

  const createGroupChat = useMutation({
    mutationFn: async () => {
      if (!chatClient) throw new Error("Chat client not initialized");

      const { data: groupChat, error: groupError } = await supabase
        .from('group_chats')
        .insert({
          name,
          description,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (groupError) throw groupError;

      const participants = selectedUsers.map(userId => ({
        group_chat_id: groupChat.id,
        user_id: userId
      }));

      const { error: participantsError } = await supabase
        .from('group_chat_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      const channel = chatClient.channel('messaging', `group-${groupChat.id}`, {
        name,
        members: [...selectedUsers, chatClient.userID!],
        description,
      });

      await channel.create();
      await channel.watch();

      return groupChat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-chats'] });
      toast({
        title: "Group created",
        description: "Your group chat has been created successfully.",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group chat. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setSelectedUsers([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }
    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one member",
        variant: "destructive",
      });
      return;
    }
    createGroupChat.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Group Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Group Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <UserSelect
              selectedUsers={selectedUsers}
              onSelectUsers={setSelectedUsers}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={createGroupChat.isPending}
            >
              {createGroupChat.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
