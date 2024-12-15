import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Event } from "@/types/event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { EventForm } from "./event/EventForm";
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "./event/EventDetails";
import { EventActions } from "./event/EventActions";

interface Guest {
  firstName: string;
}

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string, guests?: Guest[]) => void;
  onCancelRSVP: (eventId: string) => void;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
}

interface Attendee {
  user_id: string;
  profiles: {
    full_name: string | null;
    username: string;
  };
}

export function EventCard({ event, onRSVP, onCancelRSVP, userRSVPStatus, onUpdate }: EventCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);

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
      const { count } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);
      setRsvpCount(count || 0);

      const { data: attendeeData } = await supabase
        .from('event_rsvps')
        .select(`
          user_id,
          profiles:profiles!event_rsvps_user_id_fkey (
            full_name,
            username
          )
        `)
        .eq('event_id', event.id)
        .eq('response', 'attending');

      if (attendeeData) {
        setAttendees(attendeeData as Attendee[]);
      }
    } catch (error) {
      console.error('Error fetching RSVP details:', error);
    }
  };

  useEffect(() => {
    checkAdminStatus();
    fetchRSVPDetails();
  }, [event.id]);

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onUpdate) onUpdate();
  };

  const isFullyBooked = rsvpCount >= event.max_guests;

  // Check if event is in the past
  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profiles.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profiles.username;
    return firstName;
  });

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white">
      <CardHeader className="relative p-0">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <EventDetails
          date={event.date}
          location={event.location}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          description={event.description || ""}
          attendeeNames={attendeeNames}
          userRSVPStatus={userRSVPStatus}
        />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <EventActions
          isAdmin={isAdmin && !isPastEvent} // Only allow editing if admin AND not a past event
          userRSVPStatus={userRSVPStatus || null}
          isFullyBooked={isFullyBooked}
          onRSVP={(guests) => onRSVP(event.id, guests)}
          onCancelRSVP={() => onCancelRSVP(event.id)}
          onEdit={() => setShowEditDialog(true)}
          isPastEvent={isPastEvent}
        />
      </CardFooter>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <EventForm
            initialData={{
              id: event.id,
              title: event.title,
              description: event.description || "",
              date: event.date,
              time: event.time,
              location: event.location,
              max_guests: event.max_guests,
              image_url: event.image_url,
            }}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}