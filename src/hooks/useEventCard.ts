import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Attendee {
  user_id: string;
  profile: {
    full_name: string | null;
    username: string;
  };
}

export function useEventCard(eventId: string, onUpdate?: () => void) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    checkAdminStatus();
    fetchRSVPDetails();
  }, [eventId]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      setIsAdmin(!!data?.is_admin);
    }
  };

  const fetchRSVPDetails = async () => {
    try {
      // Get RSVP count
      const { count } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
      setRsvpCount(count || 0);

      // Get attendees with their profile information
      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('response', 'attending');

      if (rsvpData) {
        const userIds = rsvpData.map(rsvp => rsvp.user_id);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', userIds);

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
      }
    } catch (error) {
      console.error('Error fetching RSVP details:', error);
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onUpdate) onUpdate();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const clickedElement = e.target as HTMLElement;
    const isClickingButton = clickedElement.tagName === 'BUTTON' || 
                            clickedElement.tagName === 'A' ||
                            clickedElement.closest('button') ||
                            clickedElement.closest('a') ||
                            clickedElement.getAttribute('role') === 'button';

    if (!isClickingButton) {
      window.location.href = `/events/${eventId}`;
    }
  };

  return {
    showEditDialog,
    setShowEditDialog,
    isAdmin,
    rsvpCount,
    attendees,
    handleEditSuccess,
    handleCardClick
  };
}