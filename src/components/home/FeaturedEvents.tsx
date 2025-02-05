
import React from 'react';
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { UpcomingEventsSection } from "./UpcomingEventsSection";
import { Loader2 } from "lucide-react";

export const FeaturedEvents = () => {
  const { events = [], isLoading, error, userRSVPs, handleRSVP, handleCancelRSVP } = useFeaturedEvents();

  console.log('FeaturedEvents render:', { events, isLoading, error, userRSVPs });

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
    .slice(0, 3) || []; // Changed from 4 to 3

  return (
    <section className="py-4 bg-[#F1F0FB]" aria-labelledby="featured-events-heading">
      <div className="container mx-auto px-4">
        <h2 id="featured-events-heading" className="sr-only">Featured Events</h2>
        <UpcomingEventsSection 
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
