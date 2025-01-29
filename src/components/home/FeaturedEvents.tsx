import React from 'react';
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { UpcomingEventsSection } from "./UpcomingEventsSection";

export const FeaturedEvents = () => {
  const { events, isLoading, userRSVPs, handleRSVP, handleCancelRSVP } = useFeaturedEvents();

  // Filter out past events and limit to 4 upcoming events
  const upcomingEvents = events
    .filter(event => {
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
    .slice(0, 4);

  console.log('Upcoming events:', upcomingEvents);

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