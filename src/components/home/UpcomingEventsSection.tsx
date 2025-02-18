
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { Event } from "@/types/event";
import { CalendarDays, Loader2 } from "lucide-react";
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

  console.log('UpcomingEventsSection render:', { events, isLoading, userRSVPs, isAuthenticated });

  return (
    <div className="py-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          <h3 id="upcoming-events-heading" className="text-2xl font-bold text-gray-900">
            Upcoming Events
          </h3>
        </div>
        <Button 
          onClick={() => navigate("/events")}
          variant="outline"
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white border-[#0d97d1] hover:border-[#0d97d1]/90 whitespace-nowrap"
        >
          View All
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            No upcoming events found.
          </p>
          <p className="text-gray-400 mt-2">
            Check back soon for new events!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id}>
              <EventCard 
                event={event} 
                onRSVP={handleRSVP}
                onCancelRSVP={handleCancelRSVP}
                userRSVPStatus={userRSVPs[event.id]}
                isAuthChecking={false}
                requireAuth={!isAuthenticated}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
