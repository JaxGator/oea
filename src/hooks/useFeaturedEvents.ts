import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

const fetchFeaturedEvents = async (): Promise<Event[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      description,
      date,
      time,
      location,
      max_guests,
      image_url,
      created_at,
      created_by,
      rsvps:event_rsvps (
        id,
        event_id,
        user_id,
        response,
        created_at
      )
    `)
    .gte('date', today)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }

  return data || [];
};

export function useFeaturedEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRSVPs, setUserRSVPs] = useState<Record<string, string>>({});

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['featuredEvents'],
    queryFn: fetchFeaturedEvents,
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

    // First, ensure the user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      toast({
        title: "Error",
        description: "Please complete your profile before RSVPing",
        variant: "destructive",
      });
      navigate("/profile");
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
}