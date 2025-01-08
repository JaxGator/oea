import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/components/providers/NotificationProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WaitlistManagerProps {
  eventId: string;
  maxGuests: number;
  waitlistCapacity: number | null;
}

export function WaitlistManager({ eventId, maxGuests, waitlistCapacity }: WaitlistManagerProps) {
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
          profiles:user_id (
            username,
            full_name,
            email_notifications
          )
        `)
        .eq('event_id', eventId)
        .eq('status', 'waitlisted')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
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
      const { error } = await supabase
        .from('event_rsvps')
        .update({ status: 'confirmed' })
        .eq('id', rsvpId);

      if (error) throw error;

      notify("success", "Attendee Promoted", "Successfully promoted from waitlist");
      refetch();
    } catch (error) {
      console.error('Error promoting from waitlist:', error);
      notify("error", "Promotion Failed", "Could not promote attendee from waitlist");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Waitlist Management</h3>
          <p className="text-sm text-muted-foreground">
            {waitlistEntries?.length || 0} people waiting
            {waitlistCapacity && ` (Capacity: ${waitlistCapacity})`}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentRSVPs}/{maxGuests} spots filled
        </div>
      </div>

      <ScrollArea className="h-[300px] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Joined Waitlist</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waitlistEntries?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  {entry.profiles.full_name || entry.profiles.username}
                </TableCell>
                <TableCell>
                  {new Date(entry.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handlePromoteFromWaitlist(entry.id)}
                    disabled={isProcessing || (currentRSVPs && currentRSVPs >= maxGuests)}
                  >
                    Promote to Attendee
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}