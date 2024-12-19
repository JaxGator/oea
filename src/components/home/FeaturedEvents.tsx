import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EventCard } from "@/components/EventCard";
import { useFeaturedEvents } from "@/hooks/useFeaturedEvents";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturedEvents = () => {
  const navigate = useNavigate();
  const { events, isLoading, userRSVPs, handleRSVP, handleCancelRSVP } = useFeaturedEvents();

  // Filter out past events and limit to 4 upcoming events
  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
      return eventDate >= today;
    })
    .slice(0, 4); // Limit to 4 events

  // Google Drive folder configuration
  const folderId = "1at3FHbzf32luuL07mKGFwfMBpFJOwTHc";
  const embedUrl = `https://drive.google.com/embeddedfolder?id=${folderId}#grid`;

  return (
    <section className="py-16 bg-[#F1F0FB]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
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
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No upcoming events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event) => (
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

        {/* Photo Gallery Section */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
          <Card>
            <CardContent className="p-4">
              <iframe 
                src={embedUrl}
                className="w-full min-h-[600px] border-0"
                title="Photo Gallery"
                allow="autoplay"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};