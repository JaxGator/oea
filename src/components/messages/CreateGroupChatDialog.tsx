import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelect } from "./UserSelect";
import { useAuthState } from "@/hooks/useAuthState";

export function CreateGroupChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuthState();

  const handleCreateChat = async () => {
    if (!chatName.trim() || selectedUsers.length === 0 || !user?.id) return;

    try {
      // Create the group chat
      const { data: chatData, error: chatError } = await supabase
        .from('group_chats')
        .insert({
          name: chatName.trim(),
          created_by: user.id
        })
        .select('id')
        .single();

      if (chatError) throw chatError;

      if (!chatData?.id) {
        throw new Error('Failed to create chat - no chat ID returned');
      }

      // Add participants including the creator
      const participants = [...selectedUsers, user.id].map(userId => ({
        chat_id: chatData.id,
        user_id: userId,
        added_by: user.id
      }));

      const { error: participantsError } = await supabase
        .from('group_chat_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      toast({
        title: "Success",
        description: "Group chat created successfully",
      });
      setIsOpen(false);
      setChatName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast({
        title: "Error",
        description: "Failed to create group chat",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Group Chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              placeholder="Chat name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <UserSelect
              selectedUsers={selectedUsers}
              onSelectUser={(userId) => setSelectedUsers(prev => [...prev, userId])}
              onRemoveUser={(userId) => setSelectedUsers(prev => prev.filter(id => id !== userId))}
            />
          </div>
          <Button onClick={handleCreateChat} disabled={!chatName.trim() || selectedUsers.length === 0}>
            Create Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}