import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useRSVPCancellation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_rsvps')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Send cancellation email
      const { error: emailError } = await supabase.functions.invoke('send-rsvp-email', {
        body: {
          eventId,
          userId: user.id,
          type: 'cancellation'
        }
      });

      if (emailError) {
        console.error('Error sending cancellation email:', emailError);
        // Don't throw here - we still want to show success even if email fails
      }

      toast({
        title: "Success",
        description: "Your RSVP has been cancelled and a confirmation email has been sent",
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-rsvps'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel RSVP",
        variant: "destructive",
      });
      console.error('RSVP cancellation error:', error);
    }
  };

  return { cancelRSVP };
};