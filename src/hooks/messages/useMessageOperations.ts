import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useMessageOperations() {
  const queryClient = useQueryClient();

  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const editMessage = useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      const { error } = await supabase
        .from('messages')
        .update({ content })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Message updated",
        description: "The message has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating message:', error);
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