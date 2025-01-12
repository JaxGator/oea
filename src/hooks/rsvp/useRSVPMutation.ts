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
      // Check if user already has an RSVP for this event
      const { data: existingRSVP } = await supabase
        .from('event_rsvps')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      let rsvpId;

      if (existingRSVP) {
        // Update existing RSVP
        const { data: updatedRSVP, error: updateError } = await supabase
          .from('event_rsvps')
          .update({
            response: 'attending',
            status: 'confirmed'
          })
          .eq('id', existingRSVP.id)
          .select()
          .single();

        if (updateError) throw updateError;
        rsvpId = existingRSVP.id;

        // Delete existing guests
        await supabase
          .from('event_guests')
          .delete()
          .eq('rsvp_id', rsvpId);
      } else {
        // Create new RSVP
        const { data: newRSVP, error: rsvpError } = await supabase
          .from('event_rsvps')
          .insert({
            event_id: eventId,
            user_id: user.id,
            response: 'attending'
          })
          .select()
          .single();

        if (rsvpError) throw rsvpError;
        rsvpId = newRSVP.id;
      }

      // Add guests if there are any
      if (guests.length > 0) {
        const guestRecords = guests.map(guest => ({
          rsvp_id: rsvpId,
          first_name: guest.firstName
        }));

        const { error: guestError } = await supabase
          .from('event_guests')
          .insert(guestRecords);

        if (guestError) throw guestError;
      }

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-rsvp-email', {
        body: {
          eventId,
          userId: user.id,
          type: 'confirmation'
        }
      });

      if (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't throw here - we still want to show success even if email fails
      }

      toast({
        title: "Success",
        description: "Your RSVP has been recorded and a confirmation email has been sent",
      });
      
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-rsvps'] });
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