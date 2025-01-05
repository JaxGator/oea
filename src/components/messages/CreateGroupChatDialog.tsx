import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserSelect } from "./UserSelect";
import { Loader2 } from "lucide-react";
import { useGroupChatCreation } from "@/hooks/useGroupChatCreation";

export function CreateGroupChatDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { createGroupChat, isLoading } = useGroupChatCreation();

  const handleCreateChat = async () => {
    const success = await createGroupChat(chatName, selectedUsers);
    if (success) {
      setIsOpen(false);
      setChatName("");
      setSelectedUsers([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Group Chat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-4">Create Group Chat</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="chat-name" className="text-sm font-medium">
              Chat Name
            </label>
            <Input
              id="chat-name"
              placeholder="Enter chat name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="h-12"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Select Participants (minimum 1)
            </label>
            <UserSelect
              selectedUsers={selectedUsers}
              onSelectUser={(userId) => setSelectedUsers(prev => [...prev, userId])}
              onRemoveUser={(userId) => setSelectedUsers(prev => prev.filter(id => id !== userId))}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleCreateChat} 
            disabled={!chatName.trim() || selectedUsers.length === 0 || isLoading}
            className="h-12 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Chat...
              </>
            ) : (
              'Create Chat'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}