
import React from 'react';
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import { Loader2 } from "lucide-react";

export const FeaturedEvents = () => {
  const { events = [], isLoading, error, userRSVPs, handleRSVP, handleCancelRSVP } = useFeaturedEvents();

  console.log('FeaturedEvents - Initial data:', {
    eventsCount: events?.length,
    events,
    isLoading,
    error,
    userRSVPs
  });

  // Filter out past events and limit to 3 upcoming events
  const upcomingEvents = events
    ?.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => {
      // Sort featured events first
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      // Then sort by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
    .slice(0, 3);

  console.log('FeaturedEvents - Filtered events:', {
    upcomingEvents,
    upcomingEventsCount: upcomingEvents?.length
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('FeaturedEvents - Error loading events:', error);
    return (
      <div className="text-center text-red-500 py-4">
        Error loading events. Please try again later.
      </div>
    );
  }

  return (
    <section className="py-4 bg-[#F1F0FB]" aria-labelledby="featured-events-heading">
      <div className="container mx-auto px-4">
        <h2 id="featured-events-heading" className="sr-only">Featured Events</h2>
        <UpcomingEventsSection 
          key={upcomingEvents?.map(e => `${e.id}-${e.date}-${e.time}`).join('-')}
          events={upcomingEvents}
          userRSVPs={userRSVPs || {}}
          handleRSVP={handleRSVP}
          handleCancelRSVP={handleCancelRSVP}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};
