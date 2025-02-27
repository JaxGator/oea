
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to RSVP",
          variant: "destructive",
        });
        return;
      }

      console.log('Starting RSVP process:', { eventId, userId: user.id, guestCount: guests.length });

      // Check if user already has an RSVP for this event
      const { data: existingRSVP, error: checkError } = await supabase
        .from('event_rsvps')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing RSVP:', checkError);
        throw checkError;
      }

      let rsvpId;

      if (existingRSVP) {
        console.log('Updating existing RSVP:', existingRSVP.id);
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

        if (updateError) {
          console.error('Error updating RSVP:', updateError);
          throw updateError;
        }
        
        rsvpId = existingRSVP.id;

        // Delete existing guests
        if (guests.length > 0) {
          const { error: deleteGuestsError } = await supabase
            .from('event_guests')
            .delete()
            .eq('rsvp_id', rsvpId);

          if (deleteGuestsError) {
            console.error('Error deleting existing guests:', deleteGuestsError);
            // Continue anyway, as this is not critical
          }
        }
      } else {
        console.log('Creating new RSVP');
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

        if (rsvpError) {
          console.error('Error creating RSVP:', rsvpError);
          throw rsvpError;
        }
        
        rsvpId = newRSVP.id;
      }

      // Add guests if there are any
      if (guests.length > 0 && rsvpId) {
        console.log('Adding guests:', guests.length);
        const guestRecords = guests.map(guest => ({
          rsvp_id: rsvpId,
          first_name: guest.firstName
        }));

        const { error: guestError } = await supabase
          .from('event_guests')
          .insert(guestRecords);

        if (guestError) {
          console.error('Error adding guests:', guestError);
          throw guestError;
        }
      }

      // Send confirmation email
      try {
        console.log('Sending confirmation email');
        const { error: emailError } = await supabase.functions.invoke('send-rsvp-email', {
          body: {
            eventId,
            userId: user.id,
            type: 'confirmation'
          }
        });

        if (emailError) {
          console.error('Error sending confirmation email:', emailError);
          toast({
            title: "RSVP Successful",
            description: "Your RSVP was recorded but there was an issue sending the confirmation email.",
          });
        } else {
          toast({
            title: "Success",
            description: "Your RSVP has been recorded and a confirmation email has been sent",
          });
        }
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        toast({
          title: "RSVP Successful",
          description: "Your RSVP was recorded but there was an issue sending the confirmation email.",
        });
      }
      
      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['events-with-rsvps'] });
      queryClient.invalidateQueries({ queryKey: ['user-rsvps'] });
    } catch (error: any) {
      console.error('RSVP error:', error);
      toast({
        title: "Error",
        description: "Failed to RSVP for the event",
        variant: "destructive",
      });
    }
  };

  return { handleRSVP };
};
