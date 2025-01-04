import React, { useState, useEffect } from 'react';
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { supabase } from "@/integrations/supabase/client";
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
    .slice(0, 4);

  return (
    <section className="py-4 bg-[#F1F0FB]">
      <div className="container mx-auto px-4">
        <UpcomingEventsSection 
          events={upcomingEvents}
          userRSVPs={userRSVPs}
          handleRSVP={handleRSVP}
          handleCancelRSVP={handleCancelRSVP}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
};