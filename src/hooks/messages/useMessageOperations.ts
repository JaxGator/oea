
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

export function useMessageOperations() {
  const queryClient = useQueryClient();
  const { user } = useAuthState();

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      console.log('Deleting message:', messageId);
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['messages', user.id] });
      }
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error in deleteMessage mutation:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const editMessage = useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      console.log('Editing message:', { messageId, content });
      
      const { error } = await supabase
        .from('messages')
        .update({ content })
        .eq('id', messageId);

      if (error) {
        console.error('Error editing message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['messages', user.id] });
      }
      toast({
        title: "Message updated",
        description: "The message has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error in editMessage mutation:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    deleteMessage: deleteMessage.mutate,
    editMessage: editMessage.mutate,
    isDeleting: deleteMessage.isPending,
    isEditing: editMessage.isPending,
  };
}
