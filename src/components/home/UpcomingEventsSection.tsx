import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { Event } from "@/types/event";

interface UpcomingEventsSectionProps {
  events: Event[];
  userRSVPs: Record<string, boolean>;
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
        <Button 
          onClick={() => navigate("/events")}
          variant="outline"
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white border-[#0d97d1] hover:border-[#0d97d1]/90"
        >
          View All Events
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No upcoming events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onRSVP={handleRSVP}
              onCancelRSVP={handleCancelRSVP}
              userRSVPStatus={userRSVPs[event.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};