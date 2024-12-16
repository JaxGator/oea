import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/types/event";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EventDetails } from "./event/EventDetails";
import { EventActions } from "./event/EventActions";
import { AddToCalendar } from "./event/AddToCalendar";
import { EventCardHeader } from "./event/EventCardHeader";
import { EventEditDialog } from "./event/EventEditDialog";
import { useNavigate } from "react-router-dom";

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
  profile: {
    full_name: string | null;
    username: string;
  };
}

export function EventCard({ event, onRSVP, onCancelRSVP, userRSVPStatus, onUpdate }: EventCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchRSVPDetails();
  }, [event.id]);

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
        .eq('event_id', event.id);
      setRsvpCount(count || 0);

      // Get attendees with their profile information
      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('user_id')
        .eq('event_id', event.id)
        .eq('response', 'attending');

      if (rsvpData) {
        // Fetch profile information for each RSVP
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
    if (
      (e.target as HTMLElement).tagName === 'BUTTON' ||
      (e.target as HTMLElement).tagName === 'A' ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }
    navigate(`/events/${event.id}`);
  };

  const isFullyBooked = rsvpCount >= event.max_guests;
  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));

  const attendeeNames = attendees.map(attendee => {
    const fullName = attendee.profile.full_name;
    const firstName = fullName ? fullName.split(' ')[0] : attendee.profile.username;
    return firstName;
  });

  return (
    <Card 
      className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      <EventCardHeader imageUrl={event.image_url} title={event.title} />
      
      <CardContent className="p-4">
        <EventDetails
          date={event.date}
          time={event.time}
          location={event.location}
          rsvpCount={rsvpCount}
          maxGuests={event.max_guests}
          description={event.description || ""}
          attendeeNames={attendeeNames}
          userRSVPStatus={userRSVPStatus}
        />
        {userRSVPStatus === 'attending' && (
          <AddToCalendar
            event={{
              title: event.title,
              description: event.description,
              date: event.date,
              time: event.time,
              location: event.location,
            }}
          />
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <EventActions
          isAdmin={isAdmin && !isPastEvent}
          userRSVPStatus={userRSVPStatus || null}
          isFullyBooked={isFullyBooked}
          onRSVP={(guests) => onRSVP(event.id, guests)}
          onCancelRSVP={() => onCancelRSVP(event.id)}
          onEdit={() => setShowEditDialog(true)}
          isPastEvent={isPastEvent}
        />
      </CardFooter>

      <EventEditDialog
        event={event}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}