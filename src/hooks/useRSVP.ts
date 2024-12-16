import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Guest {
  firstName: string;
}

export const useRSVP = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRSVP = async (eventId: string, guests: Guest[] = []) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      // Use maybeSingle() instead of single() to handle the case where no RSVP exists
      const { data: existingRSVP, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (rsvpError) throw rsvpError;

      let rsvpId;

      if (existingRSVP) {
        const { error: updateError } = await supabase
          .from('event_rsvps')
          .update({ response: 'attending' })
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
        rsvpId = existingRSVP.id;
      } else {
        const { data: newRSVP, error: insertError } = await supabase
          .from('event_rsvps')
          .insert({
            event_id: eventId,
            user_id: user.id,
            response: 'attending'
          })
          .select()
          .single();

        if (insertError) throw insertError;
        rsvpId = newRSVP.id;
      }

      // Add guests
      if (guests.length > 0) {
        const { error: guestError } = await supabase
          .from('event_guests')
          .insert(
            guests.map(guest => ({
              rsvp_id: rsvpId,
              first_name: guest.firstName || null
            }))
          );

        if (guestError) throw guestError;
      }

      toast({
        title: "Success",
        description: "Your RSVP has been recorded",
      });
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to RSVP for the event",
        variant: "destructive",
      });
      console.error('RSVP error:', error);
    }
  };

  const cancelRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_rsvps')
        .delete()
        .match({ event_id: eventId, user_id: user.id });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your RSVP has been cancelled",
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel RSVP",
        variant: "destructive",
      });
      console.error('Cancel RSVP error:', error);
    }
  };

  return { handleRSVP, cancelRSVP };
};