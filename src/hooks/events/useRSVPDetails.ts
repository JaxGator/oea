import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Attendee {
  user_id: string;
  profile: {
    full_name: string | null;
    username: string;
  };
}

export function useRSVPDetails(eventId: string) {
  const [rsvpCount, setRsvpCount] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRSVPDetails();
  }, [eventId]);

  const fetchRSVPDetails = async () => {
    try {
      // Get RSVP count with error handling
      const { count, error: countError } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      if (countError) throw countError;
      setRsvpCount(count || 0);

      // Get attendees with their profile information
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('response', 'attending');

      if (rsvpError) throw rsvpError;

      if (rsvpData && rsvpData.length > 0) {
        const userIds = rsvpData.map(rsvp => rsvp.user_id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', userIds);

        if (profileError) throw profileError;

        if (profileData) {
          const attendeeData = rsvpData.map(rsvp => {
            const profile = profileData.find(p => p.id === rsvp.user_id);
            return {
              user_id: rsvp.user_id,
              profile: {
                full_name: profile?.full_name || null,
                username: profile?.username || ''
              }
            };
          });
          setAttendees(attendeeData);
        }
      } else {
        setAttendees([]);
      }
      
      setError(null);
    } catch (error: any) {
      console.error('Error fetching RSVP details:', error);
      setError(error.message);
      setRsvpCount(0);
      setAttendees([]);
    }
  };

  return { rsvpCount, attendees, error };
}