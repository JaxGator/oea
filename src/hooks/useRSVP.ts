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
      // Check if RSVP already exists
      const { data: existingRSVP } = await supabase
        .from('event_rsvps')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      let rsvpId;

      if (existingRSVP) {
        // If RSVP exists, use its ID
        rsvpId = existingRSVP.id;
        
        // Delete existing guests
        await supabase
          .from('event_guests')
          .delete()
          .eq('rsvp_id', rsvpId);
      } else {
        // Create new RSVP if none exists
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

      // Add new guests if there are any
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

      toast({
        title: "Success",
        description: existingRSVP ? "Your RSVP has been updated" : "Your RSVP has been recorded",
      });
      
      // Invalidate both events and event-rsvps queries
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

      // Invalidate both events and event-rsvps queries
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

  return { handleRSVP, cancelRSVP };
};