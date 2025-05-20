
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { WaitlistTable } from "./waitlist/WaitlistTable";
import { WaitlistHeader } from "./waitlist/WaitlistHeader";
import type { WaitlistEntry } from "./waitlist/types";

interface WaitlistManagerProps {
  eventId: string;
  maxGuests: number;
  waitlistCapacity: number | null;
}

export function WaitlistManager({ 
  eventId, 
  maxGuests, 
  waitlistCapacity 
}: WaitlistManagerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { notify } = useNotifications();

  const { data: waitlistEntries, refetch } = useQuery({
    queryKey: ['waitlist', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          id,
          created_at,
          profiles:profiles (
            username,
            full_name,
            email_notifications,
            id
          )
        `)
        .eq('event_id', eventId)
        .eq('status', 'waitlisted')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match our WaitlistEntry type
      return (data as any[]).map(entry => ({
        id: entry.id,
        created_at: entry.created_at,
        profiles: {
          ...entry.profiles,
          user_id: entry.profiles.id // Map the id to user_id for compatibility
        }
      })) as WaitlistEntry[];
    },
  });

  const { data: currentRSVPs } = useQuery({
    queryKey: ['rsvp-count', eventId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed');

      if (error) throw error;
      return count || 0;
    },
  });

  const handlePromoteFromWaitlist = async (rsvpId: string) => {
    if (currentRSVPs && currentRSVPs >= maxGuests) {
      notify("error", "Event is full", "Cannot promote more attendees at this time");
      return;
    }

    setIsProcessing(true);
    try {
      const entry = waitlistEntries?.find(entry => entry.id === rsvpId);
      if (!entry) throw new Error("Entry not found");

      // Update RSVP status
      const { error: rsvpError } = await supabase
        .from('event_rsvps')
        .update({ status: 'confirmed' })
        .eq('id', rsvpId);

      if (rsvpError) throw rsvpError;

      // Create notification using fetch API instead of direct database access
      try {
        const response = await fetch('/api/notifications/create-waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId,
            userId: entry.profiles.user_id,
            notificationType: 'promoted'
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create notification');
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Continue execution even if notification creation fails
      }

      notify("success", "Attendee Promoted", "Successfully promoted from waitlist");
      refetch();
    } catch (error) {
      console.error('Error promoting from waitlist:', error);
      notify("error", "Promotion Failed", "Could not promote attendee from waitlist");
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = {
    waitlistCount: waitlistEntries?.length || 0,
    waitlistCapacity,
    currentRSVPs,
    maxGuests
  };

  return (
    <div className="space-y-4">
      <WaitlistHeader stats={stats} />
      <WaitlistTable
        entries={waitlistEntries || []}
        isProcessing={isProcessing}
        currentRSVPs={currentRSVPs}
        maxGuests={maxGuests}
        onPromote={handlePromoteFromWaitlist}
      />
    </div>
  );
}
