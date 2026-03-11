
import { format, parse, isAfter, isBefore, addDays } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const updateEventRSVPStatus = async (eventId: string, newStatus: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to RSVP");
      return;
    }

    const { error } = await supabase
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        response: newStatus,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    toast.success(`You are now ${newStatus === 'attending' ? 'attending' : 'not attending'} this event`);
    
    return true;
  } catch (error) {
    console.error("Error updating RSVP status:", error);
    toast.error("Failed to update your RSVP status");
    return false;
  }
};

export const cancelEventRSVP = async (eventId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to cancel an RSVP");
      return;
    }

    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    toast.success("Your RSVP has been cancelled");
    
    return true;
  } catch (error) {
    console.error("Error cancelling RSVP:", error);
    toast.error("Failed to cancel your RSVP");
    return false;
  }
};

export const joinEventWaitlist = async (eventId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to join the waitlist");
      return false;
    }

    // First check if already on waitlist
    const { data: existingEntry, error: checkError } = await supabase
      .from('event_waitlist' as any)
      .select('id')
      .match({ event_id: eventId, user_id: user.id })
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingEntry) {
      toast.error("You are already on the waitlist for this event");
      return false;
    }

    // Add to waitlist
    const { error } = await supabase
      .from('event_waitlist' as any)
      .insert({
        event_id: eventId,
        user_id: user.id,
        joined_at: new Date().toISOString()
      });

    if (error) throw error;

    toast.success("You have been added to the waitlist");
    return true;
  } catch (error) {
    console.error("Error joining waitlist:", error);
    toast.error("Failed to join the waitlist");
    return false;
  }
};

export const leaveEventWaitlist = async (eventId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to leave the waitlist");
      return false;
    }

    const { error } = await supabase
      .from('event_waitlist' as any)
      .delete()
      .match({ event_id: eventId, user_id: user.id });

    if (error) throw error;

    toast.success("You have been removed from the waitlist");
    return true;
  } catch (error) {
    console.error("Error leaving waitlist:", error);
    toast.error("Failed to leave the waitlist");
    return false;
  }
};
