import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OeaEvent } from "@/lib/oea";

const EVENT_SELECT = `
  *,
  event_rsvps (
    id,
    user_id,
    response,
    status,
    event_guests ( id ),
    profiles:profiles!event_rsvps_user_id_fkey ( full_name, username )
  )
`;

/**
 * All events the viewer is allowed to see.
 * Members/admins additionally see drafts so they can manage them.
 */
export function useOeaEvents(includeUnpublished = false) {
  return useQuery({
    queryKey: ["oea-events", includeUnpublished],
    queryFn: async (): Promise<OeaEvent[]> => {
      let query = (supabase as any).from("events").select(EVENT_SELECT);
      if (!includeUnpublished) {
        query = query.eq("is_published", true);
      }
      const { data, error } = await query.order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OeaEvent[];
    },
    staleTime: 60_000,
  });
}

/** Single event looked up by slug, falling back to id for legacy links. */
export function useOeaEvent(slugOrId?: string) {
  return useQuery({
    queryKey: ["oea-event", slugOrId],
    enabled: !!slugOrId,
    queryFn: async (): Promise<OeaEvent | null> => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(slugOrId!);
      const { data, error } = await (supabase as any)
        .from("events")
        .select(EVENT_SELECT)
        .eq(isUuid ? "id" : "slug", slugOrId)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as OeaEvent | null;
    },
  });
}

export interface EventFormValues {
  id?: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  end_time: string | null;
  place: string;
  location: string;
  max_guests: number;
  difficulty: string;
  organizer: string;
  status: string;
  tags: string[];
  image_url: string;
}

export function useSaveOeaEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: EventFormValues) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to save an event.");

      const payload: Record<string, unknown> = {
        title: values.title,
        slug: values.slug,
        description: values.description,
        date: values.date,
        time: values.time,
        end_time: values.end_time,
        place: values.place || null,
        location: values.location,
        max_guests: values.max_guests,
        difficulty: values.difficulty || null,
        organizer: values.organizer || null,
        status: values.status,
        is_published: values.status === "published",
        tags: values.tags,
        image_url: values.image_url,
      };

      if (values.id) {
        const { error } = await (supabase as any)
          .from("events")
          .update(payload)
          .eq("id", values.id);
        if (error) throw error;
        return values.id;
      }

      payload.created_by = user.id;
      const { data, error } = await (supabase as any)
        .from("events")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oea-events"] });
      queryClient.invalidateQueries({ queryKey: ["oea-event"] });
      toast.success("Event saved");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save event"),
  });
}

export function useDeleteOeaEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oea-events"] });
      toast.success("Event deleted");
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete event"),
  });
}
