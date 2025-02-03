import { useAuthState } from "@/hooks/useAuthState";
import { format } from "date-fns";
import { isEventPast } from "@/utils/dateTimeUtils";
import { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  userRSVPStatus: string | null;
  onSelect?: () => void;
  isSelected?: boolean;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
}

export function EventCard({ 
  event,
  onRSVP,
  onCancelRSVP,
  userRSVPStatus,
  onSelect,
  isSelected,
  isAuthChecking,
  requireAuth = false,
}: EventCardProps) {
  const { isAuthenticated, profile } = useAuthState();
  const { isAdmin } = useAdminStatus();
  const canManageEvents = isAdmin || (profile?.is_member && profile?.is_approved);
  
  const isPastEvent = isEventPast(event.date, event.time);
  const isWixEvent = !!event.imported_rsvp_count;

  const formattedDate = format(new Date(event.date), 'MMMM d, yyyy');
  const formattedTime = format(new Date(event.date + 'T' + event.time), 'h:mm a');

  return (
    <div className={`event-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <h3 className="event-title">{event.title}</h3>
      <p className="event-date">{formattedDate} at {formattedTime}</p>
      <p className="event-location">{event.location}</p>
      <p className="event-description">{event.description}</p>
      <div className="event-actions">
        {isPastEvent ? (
          <span className="event-status">Past Event</span>
        ) : (
          <>
            {userRSVPStatus ? (
              <button onClick={onCancelRSVP}>Cancel RSVP</button>
            ) : (
              <button onClick={() => onRSVP()}>RSVP</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
