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
      // First get the RSVP to get its ID
      const { data: rsvp } = await supabase
        .from('event_rsvps')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (rsvp) {
        // Delete associated guests first
        await supabase
          .from('event_guests')
          .delete()
          .eq('rsvp_id', rsvp.id);

        // Then delete the RSVP
        const { error } = await supabase
          .from('event_rsvps')
          .delete()
          .eq('id', rsvp.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Your RSVP has been cancelled",
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-rsvps', eventId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel RSVP",
        variant: "destructive",
      });
      console.error('Cancel RSVP error:', error);
    }
  };

  return { cancelRSVP };
};