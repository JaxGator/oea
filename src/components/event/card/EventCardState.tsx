import { cn } from "@/lib/utils";
import { Event } from "@/types/event";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

interface EventCardStateProps {
  event: Event;
  confirmedCount: number;
  waitlistCount: number;
  userRSVPStatus?: string | null;
  onUpdate?: () => void;
  render: (props: {
    isAdmin: boolean;
    canManageEvents: boolean;
    rsvpData: {
      confirmedCount: number;
      waitlistCount: number;
    };
    attendees: any[];
    guests: any[];
    isPastEvent: boolean;
    isWixEvent: boolean;
    canAddGuests: boolean;
    showEditDialog: boolean;
    showDetailsDialog: boolean;
    handleEditSuccess: () => void;
    handleDelete: () => void;
    handleTogglePublish: () => void;
    setShowEditDialog: (show: boolean) => void;
    setShowDetailsDialog: (show: boolean) => void;
  }) => React.ReactNode;
}

export function EventCardState({ 
  event, 
  confirmedCount, 
  waitlistCount,
  userRSVPStatus,
  onUpdate,
  render 
}: EventCardStateProps) {
  const isWixEvent = Boolean(event.imported_rsvp_count);
  const totalAttendees = isWixEvent ? event.imported_rsvp_count || 0 : confirmedCount;
  const spotsLeft = event.max_guests - totalAttendees;
  const isFullyBooked = spotsLeft <= 0;
  const isPastEvent = new Date(event.date) < new Date();

  const renderSpotsBadge = () => {
    if (isPastEvent) {
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          Event Ended
        </Badge>
      );
    }

    if (isFullyBooked) {
      return (
        <Badge variant="destructive">
          Fully Booked
          {event.waitlist_enabled && waitlistCount > 0 && ` (${waitlistCount} on waitlist)`}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-green-500 text-green-600">
        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
      </Badge>
    );
  };

  return render({
    isAdmin: true, // This should be determined by user role
    canManageEvents: true, // This should be determined by user permissions
    rsvpData: {
      confirmedCount,
      waitlistCount
    },
    attendees: [],
    guests: [],
    isPastEvent,
    isWixEvent,
    canAddGuests: !isPastEvent && !isFullyBooked,
    showEditDialog: false,
    showDetailsDialog: false,
    handleEditSuccess: () => onUpdate?.(),
    handleDelete: () => {}, // Implement delete functionality
    handleTogglePublish: () => {}, // Implement toggle publish functionality
    setShowEditDialog: () => {}, // Implement dialog state management
    setShowDetailsDialog: () => {} // Implement dialog state management
  });
}