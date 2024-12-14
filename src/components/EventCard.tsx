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

export function EventCard({ event, onRSVP, onCancelRSVP, userRSVPStatus, onUpdate }: EventCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isFullyBooked = event.attendees >= event.maxAttendees;

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

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    if (onUpdate) onUpdate();
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg animate-fade-in bg-white">
      <CardHeader className="relative p-0">
        <img
          src={event.imageUrl}
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
            {event.attendees} / {event.maxAttendees} attendees
          </span>
        </div>
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
              description: event.description,
              date: event.date,
              time: event.time || "12:00",
              location: event.location,
              max_guests: event.maxAttendees,
            }}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}