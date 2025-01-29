import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { Event } from "@/types/event";
import { CalendarDays } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

interface UpcomingEventsSectionProps {
  events: Event[];
  userRSVPs: Record<string, string | null>;
  handleRSVP: (eventId: string) => void;
  handleCancelRSVP: (eventId: string) => void;
  isLoading: boolean;
}

export const UpcomingEventsSection = ({
  events,
  userRSVPs,
  handleRSVP,
  handleCancelRSVP,
  isLoading,
}: UpcomingEventsSectionProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthState();

  console.log("UpcomingEventsSection - events:", events);

  return (
    <div className="py-1">
      <div className="flex justify-between items-center mb-4 gap-4">
        <h3 id="upcoming-events-heading" className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarDays className="h-6 w-6" role="presentation" />
          Upcoming Events
        </h3>
        <Button 
          onClick={() => navigate("/events")}
          variant="outline"
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white border-[#0d97d1] hover:border-[#0d97d1]/90"
        >
          View All Events
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4 text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id}>
              <EventCard 
                event={event} 
                onRSVP={handleRSVP}
                onCancelRSVP={handleCancelRSVP}
                userRSVPStatus={userRSVPs[event.id]}
                isAuthChecking={false}
                requireAuth={!isAuthenticated}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};