import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRSVPStatus } from "../rsvp/useRSVPStatus";

export const useRSVPManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRSVPs, setUserRSVPs] = useState<Record<string, string>>({});

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

    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'event_rsvps',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('RSVP change received:', payload);
            
            // Refresh RSVPs when changes occur
            fetchUserRSVPs();

            // Show toast notification based on the type of change
            if (payload.eventType === 'INSERT') {
              toast({
                title: "RSVP Confirmed",
                description: "Your RSVP has been successfully recorded.",
              });
            } else if (payload.eventType === 'DELETE') {
              toast({
                title: "RSVP Cancelled",
                description: "Your RSVP has been cancelled.",
              });
            } else if (payload.eventType === 'UPDATE') {
              toast({
                title: "RSVP Updated",
                description: "Your RSVP has been updated.",
              });
            }
          }
        )
        .subscribe();

      return channel;
    };

    // Set up subscription and store for cleanup
    let channel: any;
    setupRealtimeSubscription().then(ch => {
      channel = ch;
    });

    // Cleanup subscription
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
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
        description: "Please log in to cancel RSVP",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from('event_rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to cancel RSVP",
        variant: "destructive",
      });
      return;
    }

    await fetchUserRSVPs();
    toast({
      title: "Success",
      description: "RSVP cancelled successfully",
    });
  };

  return {
    userRSVPs,
    handleRSVP,
    handleCancelRSVP,
  };
};