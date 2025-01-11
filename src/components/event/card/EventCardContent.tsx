import { CardContent, CardFooter } from "@/components/ui/card";
import { EventCardBasicInfo } from "./EventCardBasicInfo";
import { FeaturedEventBadge } from "./FeaturedEventBadge";
import { EventCardActions } from "./EventCardActions";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Event } from "@/types/event";

interface EventCardContentProps {
  event: Event;
  date: string;
  location: string;
  rsvpCount: number;
  maxGuests: number;
  isWixEvent: boolean;
  isAdmin: boolean;
  userRSVPStatus: string | null;
  isPastEvent: boolean;
  canAddGuests: boolean;
  waitlistEnabled?: boolean;
  waitlistCount?: number;
  waitlistCapacity?: number | null;
  isFeatured?: boolean;
  currentGuests?: { firstName: string }[];
  importedRsvpCount?: number | null;
  onRSVP: (guests?: { firstName: string }[]) => void;
  onCancelRSVP: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

export function EventCardContent({
  event,
  date,
  location,
  rsvpCount,
  maxGuests,
  isWixEvent,
  isAdmin,
  userRSVPStatus,
  isPastEvent,
  canAddGuests,
  waitlistEnabled,
  waitlistCount = 0,
  waitlistCapacity,
  isFeatured = false,
  currentGuests = [],
  importedRsvpCount,
  onRSVP,
  onCancelRSVP,
  onEdit,
  onDelete,
  onViewDetails,
}: EventCardContentProps) {
  const [isEditingRSVP, setIsEditingRSVP] = useState(false);
  const [editedRSVPCount, setEditedRSVPCount] = useState(rsvpCount.toString());

  const isFullyBooked = rsvpCount >= maxGuests;
  const canJoinWaitlist = waitlistEnabled && isFullyBooked && 
    (!waitlistCapacity || waitlistCount < waitlistCapacity);

  const handleRSVPEdit = async () => {
    const newCount = parseInt(editedRSVPCount);
    if (isNaN(newCount) || newCount < 0) {
      toast({
        title: "Invalid count",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .update({ imported_rsvp_count: newCount })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "RSVP count updated successfully",
      });
      setIsEditingRSVP(false);
    } catch (error) {
      console.error('Error updating RSVP count:', error);
      toast({
        title: "Error",
        description: "Failed to update RSVP count",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <EventCardBasicInfo
            date={date}
            location={location}
            rsvpCount={rsvpCount}
            maxGuests={maxGuests}
            isWixEvent={isWixEvent}
            waitlistEnabled={waitlistEnabled}
            waitlistCount={waitlistCount}
            waitlistCapacity={waitlistCapacity}
            importedRsvpCount={importedRsvpCount}
            isPastEvent={isPastEvent}
          />
          {isFeatured && <FeaturedEventBadge />}
        </div>

        {isAdmin && isPastEvent && (
          <div className="mt-2 mb-4">
            {isEditingRSVP ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={editedRSVPCount}
                  onChange={(e) => setEditedRSVPCount(e.target.value)}
                  className="w-24"
                  min="0"
                />
                <Button 
                  size="sm" 
                  onClick={handleRSVPEdit}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditingRSVP(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingRSVP(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit RSVP Count
              </Button>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewDetails}
          className="w-full mt-2"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <EventCardActions
          isAdmin={isAdmin}
          userRSVPStatus={userRSVPStatus}
          isFullyBooked={isFullyBooked}
          canJoinWaitlist={canJoinWaitlist}
          onRSVP={onRSVP}
          onCancelRSVP={onCancelRSVP}
          onEdit={onEdit}
          onDelete={onDelete}
          isPastEvent={isPastEvent}
          isWixEvent={isWixEvent}
          canAddGuests={canAddGuests}
          currentGuests={currentGuests}
        />
      </CardFooter>
    </>
  );
}