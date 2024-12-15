import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

export const useFeaturedEvents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRSVPs, setUserRSVPs] = useState<Record<string, string>>({});

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          created_by(username),
          rsvps:event_rsvps(*)
        `)
        .order('date', { ascending: true })
        .limit(4);

      if (error) throw error;
      return data as Event[];
    },
  });

  const fetchUserRSVPs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: rsvps, error } = await supabase
      .from("event_rsvps")
      .select("event_id, response")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching RSVPs:", error);
      return;
    }

    const rsvpMap = rsvps?.reduce((acc, rsvp) => ({
      ...acc,
      [rsvp.event_id]: rsvp.response
    }), {});

    setUserRSVPs(rsvpMap || {});
  };

  useEffect(() => {
    fetchUserRSVPs();
  }, []);

  const handleRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to RSVP",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    navigate(`/events?rsvp=${eventId}`);
  };

  const handleCancelRSVP = async (eventId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to cancel your RSVP",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your RSVP has been cancelled",
      });

      await fetchUserRSVPs();
    } catch (error: any) {
      console.error("Error cancelling RSVP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel RSVP",
        variant: "destructive",
      });
    }
  };

  return {
    events,
    isLoading,
    userRSVPs,
    handleRSVP,
    handleCancelRSVP,
  };
};