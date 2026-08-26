import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RsvpArgs {
  eventId: string;
  /** Total party size including the member themselves. */
  partySize: number;
}

/** Create or update the current user's RSVP, storing extra guests as rows in event_guests. */
export function useSetRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, partySize }: RsvpArgs) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in to RSVP.");

      const { data: existing } = await (supabase as any)
        .from("event_rsvps")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      let rsvpId = existing?.id as string | undefined;

      if (rsvpId) {
        const { error } = await (supabase as any)
          .from("event_rsvps")
          .update({ response: "attending" })
          .eq("id", rsvpId);
        if (error) throw error;
        await (supabase as any).from("event_guests").delete().eq("rsvp_id", rsvpId);
      } else {
        const { data, error } = await (supabase as any)
          .from("event_rsvps")
          .insert({ event_id: eventId, user_id: user.id, response: "attending" })
          .select("id")
          .single();
        if (error) throw error;
        rsvpId = data.id as string;
      }

      const extraGuests = Math.max(0, partySize - 1);
      if (extraGuests > 0) {
        const rows = Array.from({ length: extraGuests }, () => ({ rsvp_id: rsvpId }));
        const { error } = await (supabase as any).from("event_guests").insert(rows);
        if (error) throw error;
      }
      return rsvpId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oea-event"] });
      queryClient.invalidateQueries({ queryKey: ["oea-events"] });
      toast.success("You're going! See you there.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save your RSVP"),
  });
}

export function useCancelRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in first.");

      const { error } = await (supabase as any)
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oea-event"] });
      queryClient.invalidateQueries({ queryKey: ["oea-events"] });
      toast.success("RSVP cancelled");
    },
    onError: (error: Error) => toast.error(error.message || "Could not cancel your RSVP"),
  });
}
