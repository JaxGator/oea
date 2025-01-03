import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelect } from "./UserSelect";
import { useAuthState } from "@/hooks/useAuthState";
import { Users, Loader2 } from "lucide-react";

interface ManageParticipantsDialogProps {
  chatId: string;
  currentParticipants: string[];
}

export function ManageParticipantsDialog({ chatId, currentParticipants }: ManageParticipantsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(currentParticipants);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthState();

  const handleUpdateParticipants = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Remove participants that are no longer selected
      const removedParticipants = currentParticipants.filter(
        id => !selectedUsers.includes(id)
      );
      
      if (removedParticipants.length > 0) {
        const { error: removeError } = await supabase
          .from('group_chat_participants')
          .delete()
          .eq('chat_id', chatId)
          .in('user_id', removedParticipants);

        if (removeError) throw removeError;
      }

      // Add new participants
      const newParticipants = selectedUsers.filter(
        id => !currentParticipants.includes(id)
      );

      if (newParticipants.length > 0) {
        const { error: addError } = await supabase
          .from('group_chat_participants')
          .insert(
            newParticipants.map(userId => ({
              chat_id: chatId,
              user_id: userId,
              added_by: user.id
            }))
          );

        if (addError) throw addError;
      }

      toast({
        title: "Success",
        description: "Participants updated successfully",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating participants:', error);
      toast({
        title: "Error",
        description: "Failed to update participants",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Manage Participants
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl mb-4">Manage Chat Participants</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Select Participants
            </label>
            <UserSelect
              selectedUsers={selectedUsers}
              onSelectUser={(userId) => setSelectedUsers(prev => [...prev, userId])}
              onRemoveUser={(userId) => setSelectedUsers(prev => prev.filter(id => id !== userId))}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleUpdateParticipants} 
            disabled={isLoading || selectedUsers.length === 0}
            className="h-12 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Participants...
              </>
            ) : (
              'Update Participants'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}