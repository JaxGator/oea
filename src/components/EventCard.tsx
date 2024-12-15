import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, PencilIcon } from "lucide-react";
import { Event } from "@/types/event";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { EventForm } from "./event/EventForm";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string) => void;
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

  // Check if user is admin
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

  // Fetch RSVP count and attendees
  const fetchRSVPDetails = async () => {
    try {
      // Get count of all RSVPs
      const { count } = await supabase
        .from('event_rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);
      setRsvpCount(count || 0);

      // Get attendees who are attending
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

  // Get display names for attendees
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
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm">
            {format(new Date(event.date), "EEEE, MMMM do, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPinIcon className="w-4 h-4" />
          <span className="text-sm">{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <UsersIcon className="w-4 h-4" />
          <span className="text-sm">
            {rsvpCount} / {event.max_guests} attendees
          </span>
        </div>
        {attendeeNames.length > 0 && (
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Attending:</p>
            <p>{attendeeNames.join(', ')}</p>
          </div>
        )}
        <p className="text-gray-600 line-clamp-2">{event.description}</p>
        {userRSVPStatus && (
          <Badge variant="secondary" className="mt-2">
            Your RSVP: {userRSVPStatus}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {userRSVPStatus ? (
          <Button
            onClick={() => onCancelRSVP(event.id)}
            variant="outline"
            className="flex-1"
          >
            Cancel RSVP
          </Button>
        ) : (
          <Button
            onClick={() => onRSVP(event.id)}
            disabled={isFullyBooked}
            className="flex-1 bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white"
          >
            {isFullyBooked ? "Fully Booked" : "RSVP Now"}
          </Button>
        )}
        {isAdmin && (
          <Button
            onClick={() => setShowEditDialog(true)}
            variant="outline"
            className="px-3"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
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