
import { Event } from "@/types/event";
import { EventDetailsSection } from "./sections/EventDetailsSection";
import { EventActionsSection } from "./sections/EventActionsSection";

interface EventCardContentProps {
  event: Event & { attendeeCount?: number; attendeeNames?: string[] };
  rsvpCount: number;
  isAdmin: boolean;
  canManageEvents: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
  currentGuests: { firstName: string }[];
  editedRSVPCount: string;
  isEditingRSVP: boolean;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showPublishToggle?: boolean;
  isPublished?: boolean;
  onViewDetails: () => void;
  onTogglePublish?: () => void;
  onEditRSVP: () => void;
  onSaveRSVP: () => void;
  onCancelEdit: () => void;
  onRSVPCountChange: (value: string) => void;
  isAuthChecking?: boolean;
  requireAuth?: boolean;
  showDelete?: boolean;
  isAuthenticated?: boolean;
}

export function EventCardContent({
  event,
  rsvpCount,
  isAdmin,
  canManageEvents,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  waitlistEnabled,
  waitlistCapacity,
  currentGuests,
  editedRSVPCount,
  isEditingRSVP,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  showPublishToggle = false,
  isPublished = true,
  onViewDetails,
  onTogglePublish,
  onEditRSVP,
  onSaveRSVP,
  onCancelEdit,
  onRSVPCountChange,
  isAuthChecking = false,
  requireAuth = false,
  showDelete = false,
  isAuthenticated = false
}: EventCardContentProps) {
  return (
    <div className="p-4">
      <EventDetailsSection
        event={event}
        rsvpCount={rsvpCount}
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        isPastEvent={isPastEvent}
        waitlistEnabled={waitlistEnabled}
        waitlistCapacity={waitlistCapacity}
        editedRSVPCount={editedRSVPCount}
        isEditingRSVP={isEditingRSVP}
        onEditRSVP={onEditRSVP}
        onSaveRSVP={onSaveRSVP}
        onCancelEdit={onCancelEdit}
        onRSVPCountChange={onRSVPCountChange}
      />

      <div className="mt-4">
        {event.attendeeNames && event.attendeeNames.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Event Attendees:</h4>
            <ul className="text-sm text-gray-600">
              {event.attendeeNames.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <EventActionsSection
        isAdmin={isAdmin}
        canManageEvents={canManageEvents}
        userRSVPStatus={userRSVPStatus}
        isPastEvent={isPastEvent}
        canAddGuests={canAddGuests}
        currentGuests={currentGuests}
        onRSVP={onRSVP}
        onCancelRSVP={onCancelRSVP}
        onEdit={onEdit}
        onDelete={onDelete}
        showPublishToggle={showPublishToggle}
        isPublished={isPublished}
        onViewDetails={onViewDetails}
        onTogglePublish={onTogglePublish}
        isAuthChecking={isAuthChecking}
        requireAuth={requireAuth}
        event={event}
        showDelete={showDelete}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
