import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useMessageReading() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const markAsReadMutation = useMutation({
    mutationFn: async ({ receiverId, senderId }: { receiverId: string; senderId: string }) => {
      const { error } = await supabase
        .rpc('mark_messages_as_read', {
          p_receiver_id: receiverId,
          p_sender_id: senderId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: "Messages marked as read",
        description: "All messages have been marked as read.",
      });
    },
    onError: (error) => {
      console.error('Error marking messages as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark messages as read. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    markMessagesAsRead: markAsReadMutation.mutate,
    isMarking: markAsReadMutation.isPending,
  };
}