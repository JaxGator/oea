import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Guest {
  firstName: string;
}

export const useRSVPMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRSVP = async (eventId: string, guests: Guest[] = []) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // First create the RSVP
      const { data: rsvp, error: rsvpError } = await supabase
        .from('event_rsvps')
        .insert({
          event_id: eventId,
          user_id: user.id,
          response: 'attending'
        })
        .select()
        .single();

      if (rsvpError) throw rsvpError;

      // Then add guests if there are any
      if (guests.length > 0) {
        const guestRecords = guests.map(guest => ({
          rsvp_id: rsvp.id,
          first_name: guest.firstName
        }));

        const { error: guestError } = await supabase
          .from('event_guests')
          .insert(guestRecords);

        if (guestError) throw guestError;
      }

      toast({
        title: "Success",
        description: "Your RSVP has been recorded",
      });
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-rsvps', eventId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to RSVP for the event",
        variant: "destructive",
      });
      console.error('RSVP error:', error);
    }
  };

  return { handleRSVP };
};